import { NextResponse } from 'next/server';

const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || 'taslimahmedtamim/UConnect';

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contributors?per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'UConnect-App'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      console.warn(`GitHub API returned status ${res.status} for ${GITHUB_REPO}`);
      return NextResponse.json({ success: true, contributors: [] });
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ success: true, contributors: [] });
    }

    const contributors = data
      .filter((c: any) => c.type === 'User')
      .map((c: any) => ({
        id: c.id,
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        contributions: c.contributions
      }))
      .sort((a: any, b: any) => b.contributions - a.contributions);

    return NextResponse.json({ success: true, contributors });
  } catch (error: any) {
    console.error('Error fetching GitHub contributors:', error.message);
    return NextResponse.json({ success: true, contributors: [] });
  }
}
