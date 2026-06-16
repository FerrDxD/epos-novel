import mammoth from "mammoth";

export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("DOCX Parse Error:", error);
    throw new Error("Gagal mem-parsing file DOCX.");
  }
}
