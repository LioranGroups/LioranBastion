# @lioran/bastion

Lightweight, file-based object storage for Node.js projects.

## Features
- Store any file type (images, pdf, zip, etc.)
- Retrieve and delete objects by unique ID
- Optional HTTP API for upload/download/delete
- Fully TypeScript typed

## Installation
```bash
npm install @lioran/bastion
```

## Quick Start
```ts
import { BastionStorage, generateObjectId } from "@lioran/bastion";

const bastion = new BastionStorage({ dataDir: "./bastion-data" });
const id = generateObjectId();
bastion.putObject("images", id, Buffer.from("hello"));
console.log(bastion.getObject("images", id).toString());
```

## HTTP Server (Optional)
```ts
import { createServer } from "@lioran/bastion/server";
import { BastionStorage } from "@lioran/bastion";

const bastion = new BastionStorage({ dataDir: "./bastion-data" });
const app = createServer(bastion);
app.listen(295);
```

## License
MIT