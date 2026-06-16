import pdfParse from "pdf-parse";

export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF Parse Error:", error);
    throw new Error("Gagal mem-parsing file PDF.");
  }
}
