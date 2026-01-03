import * as fs from "fs";
import * as path from "path";

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getObjectPath(baseDir: string, store: string, objectId: string) {
  return path.join(baseDir, store, objectId);
}
