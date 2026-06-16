export async function fetchGoogleDoc(url: string): Promise<string> {
  try {
    // Extract doc ID: https://docs.google.com/document/d/DOC_ID/edit
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) throw new Error("URL Google Docs tidak valid.");
    const docId = match[1];

    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    const res = await fetch(exportUrl);
    if (!res.ok) throw new Error("Gagal mengambil teks. Pastikan link di-set ke 'Public/Anyone with the link'.");

    return await res.text();
  } catch (error: any) {
    console.error("Google Docs Fetch Error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat mem-fetch Google Docs.");
  }
}

export async function fetchGoogleDrive(url: string): Promise<string> {
  try {
    // Extract file ID
    let fileId = "";
    const fileMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);

    if (fileMatch) fileId = fileMatch[1];
    else if (idMatch) fileId = idMatch[1];
    else throw new Error("URL Google Drive tidak valid.");

    const exportUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const res = await fetch(exportUrl);
    if (!res.ok) throw new Error("Gagal mengambil file. Pastikan link di-set ke 'Public/Anyone with the link'.");

    return await res.text();
  } catch (error: any) {
    console.error("Google Drive Fetch Error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat mem-fetch Google Drive.");
  }
}
