# Lioran Bastion

Lioran Bastion is a lightweight, file-based object storage system for Node.js. It can store, retrieve, and delete binary files (images, documents, etc.) in a structured way. Designed as a reusable module, you can use it directly in your Node/TypeScript projects or expose it via HTTP.

---

## Installation

```bash
npm install @lioran/bastion
```

---

## Usage

### Core Module

```ts
import { BastionStorage, generateObjectId } from "@lioran/bastion";

const bastion = new BastionStorage({ dataDir: "./bastion-data" });

const objectId = generateObjectId();

// Store a file buffer
bastion.putObject("images", objectId, Buffer.from("hello world"));

// Retrieve file
const data = bastion.getObject("images", objectId);
console.log(data.toString());

// Delete file
bastion.deleteObject("images", objectId);
```

### HTTP Server (Optional)

You can run a built-in HTTP server:

```ts
import { BastionStorage } from "@lioran/bastion/server";

const bastion = new BastionStorage({ dataDir: "./bastion-data" });
const app = createServer(bastion);
app.listen(295, () => console.log("Lioran Bastion running on http://localhost:295"));
```

Endpoints:

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /put/:store | Upload file (field name: `file`) |
| GET  | /get/:store/:objectId | Download file |
| DELETE | /delete/:store/:objectId | Delete file |

---

## Features

- File-based storage, no DB required
- Store any binary file (png, jpeg, pdf, etc.)
- Unique object IDs
- Optional HTTP API
- Fully TypeScript typed

---

## License
MIT