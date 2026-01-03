// src/driver.ts
import FormData from "form-data";
import fetch from "node-fetch";

/* -------------------- TYPES -------------------- */

interface BastionDriverOptions {
  url: string;
  accessKey: string;
}

interface PutResponse {
  store: string;
  objectId: string;
  size: number;
}

/* -------------------- DRIVER -------------------- */

export class BastionDriver {
  private url: string;
  private accessKey: string;

  constructor(options: BastionDriverOptions) {
    this.url = options.url.replace(/\/$/, "");
    this.accessKey = options.accessKey;
  }

  private headers() {
    return {
      "x-access-key": this.accessKey,
    };
  }

  /* -------------------- PUT -------------------- */
  async put(
    store: string,
    file: Buffer,
    filename = "file"
  ): Promise<PutResponse> {
    const form = new FormData();
    form.append("file", file, filename);

    const res = await fetch(`${this.url}/put/${store}`, {
      method: "POST",
      headers: {
        ...this.headers(),
        ...form.getHeaders(),
      },
      body: form as any,
    });

    if (!res.ok) {
      throw new Error(`PUT_FAILED (${res.status})`);
    }

    const data = (await res.json()) as PutResponse;
    return data;
  }

  /* -------------------- GET -------------------- */
  async get(store: string, objectId: string): Promise<Buffer> {
    const res = await fetch(
      `${this.url}/get/${store}/${objectId}`,
      { headers: this.headers() }
    );

    if (!res.ok) {
      throw new Error(`GET_FAILED (${res.status})`);
    }

    return Buffer.from(await res.arrayBuffer());
  }

  /* -------------------- DELETE -------------------- */
  async delete(store: string, objectId: string): Promise<void> {
    const res = await fetch(
      `${this.url}/delete/${store}/${objectId}`,
      {
        method: "DELETE",
        headers: this.headers(),
      }
    );

    if (!res.ok) {
      throw new Error(`DELETE_FAILED (${res.status})`);
    }
  }
}
