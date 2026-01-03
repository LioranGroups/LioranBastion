// src/server.ts
import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import cors from "cors";
import { BastionStorage } from "./core/storage";
import { generateObjectId } from "./utils/id";

/* -------------------- TYPES -------------------- */

type Permission = {
  put?: boolean;
  get?: boolean;
  delete?: boolean;
};

type AccessKeyConfig = {
  key: string;
  permissions: Permission;
  stores?: string[];
  maxSizeMB?: number;
};

interface ServerOptions {
  accessKeys: AccessKeyConfig[];
  allowedOrigins?: string[];
}

/* -------------------- SERVER -------------------- */

export function createServer(
  bastion: BastionStorage,
  options: ServerOptions
) {
  const app = express();
  const upload = multer();

  /* -------------------- CORS -------------------- */
  app.use(
    cors({
      origin: options.allowedOrigins ?? "*",
    })
  );

  /* -------------------- AUTH -------------------- */

  function authenticate(action: keyof Permission) {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = req.headers["x-access-key"];

      if (typeof key !== "string") {
        return res.status(401).json({ error: "NO_ACCESS_KEY" });
      }

      const config = options.accessKeys.find(k => k.key === key);
      if (!config) {
        return res.status(401).json({ error: "INVALID_ACCESS_KEY" });
      }

      if (!config.permissions[action]) {
        return res.status(403).json({ error: "FORBIDDEN" });
      }

      const store = req.params.store;
      if (config.stores && !config.stores.includes(store)) {
        return res.status(403).json({ error: "STORE_NOT_ALLOWED" });
      }

      if (action === "put" && req.file && config.maxSizeMB) {
        const maxBytes = config.maxSizeMB * 1024 * 1024;
        if (req.file.size > maxBytes) {
          return res.status(413).json({ error: "FILE_TOO_LARGE" });
        }
      }

      next();
    };
  }

  /* -------------------- ROUTES -------------------- */

  app.post(
    "/put/:store",
    upload.single("file"),
    authenticate("put"),
    (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).json({ error: "NO_FILE" });
      }

      const store = req.params.store;
      const objectId = generateObjectId();

      bastion.putObject(store, objectId, req.file.buffer);

      res.json({
        store,
        objectId,
        size: req.file.size,
      });
    }
  );

  app.get(
    "/get/:store/:objectId",
    authenticate("get"),
    (req: Request, res: Response) => {
      try {
        const { store, objectId } = req.params;
        const data = bastion.getObject(store, objectId);
        res.send(data);
      } catch {
        res.status(404).json({ error: "NOT_FOUND" });
      }
    }
  );

  app.delete(
    "/delete/:store/:objectId",
    authenticate("delete"),
    (req: Request, res: Response) => {
      try {
        const { store, objectId } = req.params;
        bastion.deleteObject(store, objectId);
        res.json({ success: true });
      } catch {
        res.status(500).json({ error: "UNKNOWN_ERROR" });
      }
    }
  );

  return app;
}
