// src/server.ts
import express, { Request, Response } from "express";
import multer from "multer";
import { BastionStorage } from "./core/storage";
import { generateObjectId } from "./utils/id";

export function createServer(bastion: BastionStorage) {
  const app = express();
  const upload = multer();

  app.post("/put/:store", upload.single("file"), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "NO_FILE" });
    const store = req.params.store;
    const objectId = generateObjectId();
    bastion.putObject(store, objectId, req.file.buffer);
    res.json({ store, objectId, size: req.file.size });
  });

  app.get("/get/:store/:objectId", (req: Request, res: Response) => {
    try {
      const { store, objectId } = req.params;
      res.send(bastion.getObject(store, objectId));
    } catch {
      res.status(404).json({ error: "NOT_FOUND" });
    }
  });

  app.delete("/delete/:store/:objectId", (req: Request, res: Response) => {
    try {
      const { store, objectId } = req.params;
      bastion.deleteObject(store, objectId);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "UNKNOWN_ERROR" });
    }
  });

  return app;
}
