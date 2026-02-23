"use server";

import { extractTextFromPDF } from "@/lib/parsePdf";

export async function extractOnServer(formData) {
    const file = formData.get("file");
    const buffer = Buffer.from(await file.arrayBuffer());
    return await extractTextFromPDF(buffer);
}