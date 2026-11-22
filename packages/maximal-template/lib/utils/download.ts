/** Save a server-authorized download in the browser and release its temporary URL. */
export function downloadBase64File(file: {
  base64: string;
  filename: string;
}): void {
  const bytes = Uint8Array.from(atob(file.base64), (character) =>
    character.charCodeAt(0),
  );
  downloadBlobFile(
    new Blob([bytes], { type: "application/octet-stream" }),
    file.filename,
  );
}

/** Initiate a browser download from an authorized bounded Blob and release its temporary URL. */
export function downloadBlobFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
