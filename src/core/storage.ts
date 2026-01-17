import * as fs from "fs";
import * as crypto from "crypto";
import { BastionConfig, PutObjectResult } from "../types/storage.js";
import { ensureDir, getObjectPath } from "../utils/fs.js";

/* -------------------- CONSTANTS -------------------- */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Recommended for GCM
const AUTH_TAG_LENGTH = 16;

/* -------------------- STORAGE -------------------- */

export class BastionStorage {
  private dataDir: string;
  private key: Buffer;

  constructor(config: BastionConfig) {
    this.dataDir = config.dataDir;
    ensureDir(this.dataDir);

    // Derive 32-byte key from provided secret
    this.key = crypto
      .createHash("sha256")
      .update(config.encryptionKey)
      .digest();
  }

  /* -------------------- ENCRYPT -------------------- */

  private encrypt(buffer: Buffer): Buffer {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(buffer),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    // [IV][AUTH_TAG][DATA]
    return Buffer.concat([iv, authTag, encrypted]);
  }

  /* -------------------- DECRYPT -------------------- */

  private decrypt(buffer: Buffer): Buffer {
    const iv = buffer.subarray(0, IV_LENGTH);
    const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
  }

  /* -------------------- PUT -------------------- */

  putObject(store: string, objectId: string, buffer: Buffer): PutObjectResult {
    const storeDir = `${this.dataDir}/${store}`;
    ensureDir(storeDir);

    const encrypted = this.encrypt(buffer);
    const filePath = getObjectPath(this.dataDir, store, objectId);

    fs.writeFileSync(filePath, encrypted);

    return {
      objectId,
      size: buffer.length, // original size
    };
  }

  /* -------------------- GET -------------------- */

  getObject(store: string, objectId: string): Buffer {
    const filePath = getObjectPath(this.dataDir, store, objectId);

    if (!fs.existsSync(filePath)) {
      throw new Error("OBJECT_NOT_FOUND");
    }

    const encrypted = fs.readFileSync(filePath);
    return this.decrypt(encrypted);
  }

  /* -------------------- DELETE -------------------- */

  deleteObject(store: string, objectId: string): void {
    const filePath = getObjectPath(this.dataDir, store, objectId);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
