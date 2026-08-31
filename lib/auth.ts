import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from './db';

export async function getUserFromRequest(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
    
    if (error || !supabaseUser) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: supabaseUser.id }
    });
    
    return user;
  } catch (error) {
    return null;
  }
}

export async function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
}
