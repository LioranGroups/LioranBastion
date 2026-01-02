import express, { Request, Response } from "express";
import multer from "multer";
import { BastionStorage } from "./core/storage";
import { generateObjectId } from "./utils/id";

const app = express();
const upload = multer();

const bastion = new BastionStorage({
  dataDir: "./bastion-data"
});

app.post(
  "/put/:store",
  upload.single("file"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "NO_FILE" });
      }

      const store = req.params.store;
      const objectId = generateObjectId();

      const result = bastion.putObject(
        store,
        objectId,
        req.file.buffer
      );

      res.json({
        store,
        objectId: result.objectId,
        size: result.size
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "UNKNOWN_ERROR";
      res.status(500).json({ error: message });
    }
  }
);

app.get(
  "/get/:store/:objectId",
  (req: Request, res: Response) => {
    try {
      const { store, objectId } = req.params;
      const buffer = bastion.getObject(store, objectId);

      res.send(buffer);
    } catch {
      res.status(404).json({ error: "NOT_FOUND" });
    }
  }
);

app.delete(
  "/delete/:store/:objectId",
  (req: Request, res: Response) => {
    try {
      const { store, objectId } = req.params;
      bastion.deleteObject(store, objectId);

      res.json({ success: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "UNKNOWN_ERROR";
      res.status(500).json({ error: message });
    }
  }
);

app.listen(4000, () => {
  console.log("Lioran Bastion running on http://localhost:4000");
});
