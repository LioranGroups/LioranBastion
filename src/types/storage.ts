export interface PutObjectResult {
  objectId: string;
  size: number;
}

export interface BastionConfig {
  dataDir: string;

  /**
   * Secret used for encrypting/decrypting stored data.
   * Can be any string, internally converted to 32-byte key.
   */
  encryptionKey: string;
}
