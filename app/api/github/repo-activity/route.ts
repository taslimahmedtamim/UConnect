import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    if (!owner || !repo) {
      return NextResponse.json({ success: false, message: 'Owner and repo are required' }, { status: 400 });
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch repository activity from GitHub' }, { status: res.status });
    }

    // This can return 202 (Accepted) if GitHub is computing the stats.
    // In a robust system we'd retry or let the client retry, but we'll return it as is.
    if (res.status === 202) {
      return NextResponse.json({ success: false, message: 'GitHub is computing stats, try again later' }, { status: 202 });
    }

    const activity = await res.json();

    return NextResponse.json({
      success: true,
      activity
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
