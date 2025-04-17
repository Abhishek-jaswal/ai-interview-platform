// app/api/upload/route.js
import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    // Retrieve form data (which includes the file)
    const formData = await req.formData();
    const file = formData.get('file');

    // Check if the file exists
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the file into a Uint8Array buffer to process it
    const uint8Array = new Uint8Array(await file.arrayBuffer());

    // Parse the PDF using pdf-parse
    const pdfData = await pdfParse(uint8Array);

    // Return the parsed text as a response
    return NextResponse.json({ text: pdfData.text });
  } catch (err) {
    console.error('PDF parsing error:', err);
    return NextResponse.json({ error: 'Failed to parse PDF', details: err.message }, { status: 500 });
  }
}
