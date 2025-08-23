// file-utils.ts
export function saveBlob(blob: Blob, filename: string, openAfter = false) {
  const url = URL.createObjectURL(blob);

  // trigger browser download
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  if (openAfter) {
    // open in a new tab (PDFs usually render inline)
    window.open(url, '_blank');
  }

  // revoke later to free memory (small delay to allow the browser to read it)
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Try to read filename from Content-Disposition */
export function filenameFromHeaders(headers: Headers | Record<string, string> | null | undefined): string | null {
  const raw = headers && ('get' in headers ? (headers as any).get('content-disposition') : (headers as any)['content-disposition']);
  if (!raw) return null;
  const m = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(raw);
  return decodeURIComponent(m?.[1] || m?.[2] || '').trim() || null;
}
