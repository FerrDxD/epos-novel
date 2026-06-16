export async function parseJson(content: string): Promise<string> {
  try {
    const data = JSON.parse(content);
    
    // Support generic arrays
    if (Array.isArray(data)) {
      return data
        .map((item, i) => `Entry ${i + 1}:\n${JSON.stringify(item, null, 2)}`)
        .join("\n\n");
    }
    
    // Support single object or Codex export format
    if (typeof data === "object" && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    
    return content;
  } catch (error) {
    console.error("JSON Parse Error:", error);
    // If it's invalid JSON, return the raw text to let Gemini figure it out
    return content;
  }
}
