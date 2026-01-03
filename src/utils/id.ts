import * as crypto from "crypto";

export function generateObjectId(): string {
  return crypto.randomUUID();
}
