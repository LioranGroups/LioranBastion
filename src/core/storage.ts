import fs from "fs";
import { BastionConfig, PutObjectResult } from "../types/storage";
import { ensureDir, getObjectPath } from "../utils/fs";

export class BastionStorage {
  private dataDir: string;

  constructor(config: BastionConfig) {
    this.dataDir = config.dataDir;
    ensureDir(this.dataDir);
  }

  putObject(store: string, objectId: string, buffer: Buffer): PutObjectResult {
    const storeDir = `${this.dataDir}/${store}`;
    ensureDir(storeDir);

    const filePath = getObjectPath(this.dataDir, store, objectId);
    fs.writeFileSync(filePath, buffer);

    return {
      objectId,
      size: buffer.length
    };
  }

  getObject(store: string, objectId: string): Buffer {
    const filePath = getObjectPath(this.dataDir, store, objectId);

    if (!fs.existsSync(filePath)) {
      throw new Error("OBJECT_NOT_FOUND");
    }

    return fs.readFileSync(filePath);
  }

  deleteObject(store: string, objectId: string): void {
    const filePath = getObjectPath(this.dataDir, store, objectId);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
