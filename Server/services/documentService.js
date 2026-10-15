
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function extractDocumentText(file) {
  const extension = file.originalname
    .split(".")
    .pop()
    .toLowerCase();

  if (extension === "txt") {
    return file.buffer.toString("utf8");
  }

  if (extension === "docx") {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  if (extension === "pdf") {
    const parser = new PDFParse({
      data: file.buffer,
    });

    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Unsupported document format");
}
