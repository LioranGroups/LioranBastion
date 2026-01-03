# @lioran/bastion

Lightweight, secure, file-based object storage for Node.js projects.

---

## ✨ Features

* Store any file type (images, PDFs, ZIPs, binaries, etc.)
* Retrieve and delete objects by unique ID
* File-based storage (no database required)
* Optional HTTP server with authentication & permissions
* Access-key based security (scoped permissions)
* CORS support for browser usage
* Fully written in TypeScript

---

## 📦 Installation

```bash
npm install @lioran/bastion
```

---

## 🚀 Quick Start (Core API)

```ts
import { BastionStorage, generateObjectId } from "@lioran/bastion";

const bastion = new BastionStorage({ dataDir: "./bastion-data" });

const id = generateObjectId();
bastion.putObject("images", id, Buffer.from("hello"));

const data = bastion.getObject("images", id);
console.log(data.toString());
```

---

## 🌐 HTTP Server (Optional)

### Basic Server

```ts
import { createServer } from "@lioran/bastion/server";
import { BastionStorage } from "@lioran/bastion";

const bastion = new BastionStorage({ dataDir: "./bastion-data" });

const app = createServer(bastion, {
  allowedOrigins: ["http://localhost:3000"],
  accessKeys: [
    {
      key: "admin-key",
      permissions: { put: true, get: true, delete: true },
    },
  ],
});

app.listen(295, () => {
  console.log("Bastion server running on port 295");
});
```

---

## 🔐 Access Keys & Permissions

Each access key can be scoped with permissions and limits:

```ts
{
  key: "upload-key",
  permissions: {
    put: true,
    get: false,
    delete: false,
  },
  stores: ["images"],
  maxSizeMB: 5,
}
```

### Permissions

* `put` → upload objects
* `get` → download objects
* `delete` → remove objects

---

## 📡 Client Driver

Use the built-in driver to interact with Bastion over HTTP.

```ts
import { BastionDriver } from "@lioran/bastion/driver";
import fs from "fs";

const bastion = new BastionDriver({
  url: "http://localhost:295",
  accessKey: "admin-key",
});

const file = fs.readFileSync("image.png");

// Upload
const { objectId } = await bastion.put("images", file);

// Download
const data = await bastion.get("images", objectId);
fs.writeFileSync("downloaded.png", data);

// Delete
await bastion.delete("images", objectId);
```

---

## 📁 Storage Structure

```
bastion-data/
 └─ images/
    └─ <objectId>
```

---

## 🧠 Philosophy

Bastion is designed to be:

* **Simple** — no unnecessary abstractions
* **Fast** — direct filesystem access
* **Portable** — works anywhere Node.js runs
* **Composable** — use core only, or HTTP, or driver

---

## 🛣️ Roadmap

* Signed URLs
* Key expiration & rotation
* Streaming uploads/downloads
* Optional encryption at rest

---

## 📄 License

MIT
