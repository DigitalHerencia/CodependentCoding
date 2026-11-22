import "server-only";
import { get } from "@vercel/blob";
import { getBlobToken } from "./client";
/** Read a private storage object with bounds on both metadata and streamed bytes. */
export async function readPrivateBlobBytes(
  pathname: string,
  maxBytes = 10 * 1024 * 1024,
) {
  const result = await get(pathname, {
    access: "private",
    token: getBlobToken(),
  });
  if (!result || result.statusCode !== 200) throw new Error("File not found.");
  if (result.blob.size > maxBytes) {
    await result.stream.cancel();
    throw new Error("File exceeds the download limit.");
  }
  const reader = result.stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error("File exceeds the download limit.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

/** Preserve the existing base64 contract for portal downloads. */
export async function readPrivateBlob(pathname: string, maxBytes?: number) {
  const bytes = await readPrivateBlobBytes(pathname, maxBytes);
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString(
    "base64",
  );
}
