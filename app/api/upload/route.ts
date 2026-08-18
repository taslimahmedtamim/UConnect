import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.', code: 'INVALID_FILE_TYPE' }, { status: 400 });
    }

    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const savedFilename = `${uniqueSuffix}-${filename}`;

    // Upload to Supabase Storage
    const supabase = getSupabase();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uconnect-uploads')
      .upload(savedFilename, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload to storage', code: 'SUPABASE_UPLOAD_ERROR' }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('uconnect-uploads')
      .getPublicUrl(savedFilename);

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed', code: 'UPLOAD_FAILED' }, { status: 500 });
  }
}
