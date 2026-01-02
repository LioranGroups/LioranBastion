# Lioran Bastion Usage Examples

## 1. Store and Retrieve a File

```ts
import { BastionStorage, generateObjectId } from "@lioran/bastion";
import fs from "fs";

const bastion = new BastionStorage({ dataDir: "./bastion-data" });
const fileBuffer = fs.readFileSync("./example.png");
const objectId = generateObjectId();

bastion.putObject("images", objectId, fileBuffer);
const retrieved = bastion.getObject("images", objectId);
fs.writeFileSync("./out.png", retrieved);
```

## 2. Delete a File

```ts
bastion.deleteObject("images", objectId);
```

## 3. Using HTTP API

```bash
curl -X POST -F "file=@example.png" http://localhost:295/put/images
curl http://localhost:295/get/images/<objectId> -o out.png
curl -X DELETE http://localhost:295/delete/images/<objectId>
```