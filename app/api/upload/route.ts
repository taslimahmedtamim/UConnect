import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded', code: 'NO_FILE' }, { status: 400 });
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 2MB limit', code: 'FILE_TOO_LARGE' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.', code: 'INVALID_FILE_TYPE' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const savedFilename = `${uniqueSuffix}-${filename}`;
    
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // If Supabase is fully configured, use it
    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-url')) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uconnect-uploads')
        .upload(savedFilename, buffer, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Supabase upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('uconnect-uploads')
        .getPublicUrl(savedFilename);

      return NextResponse.json({ success: true, url: publicUrl });
    }
    
    // Fallback: Save to public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure the uploads directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const filePath = path.join(uploadDir, savedFilename);
    await writeFile(filePath, buffer);

    // Return the public URL
    return NextResponse.json({ success: true, url: `/uploads/${savedFilename}` });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed', code: 'UPLOAD_FAILED' }, { status: 500 });
  }
}

