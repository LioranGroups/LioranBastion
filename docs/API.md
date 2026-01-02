# Lioran Bastion API Reference

## BastionStorage

### Constructor
`new BastionStorage(config: BastionConfig)`
- `config.dataDir`: string - path to store files

### Methods

- `putObject(store: string, objectId: string, buffer: Buffer): PutObjectResult`
- `getObject(store: string, objectId: string): Buffer`
- `deleteObject(store: string, objectId: string): void`

## Utility Functions

- `generateObjectId(): string` - Generates a unique UUID for object storage

## HTTP Endpoints (Optional Server)

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /put/:store | Upload file (field name: `file`) |
| GET  | /get/:store/:objectId | Download file |
| DELETE | /delete/:store/:objectId | Delete file |

**Example:**
```ts
import { createServer } from "@lioran/bastion/server";
import { BastionStorage } from "@lioran/bastion";

const bastion = new BastionStorage({ dataDir: "./bastion-data" });
const app = createServer(bastion);
app.listen(295);
```