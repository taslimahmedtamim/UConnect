import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ success: false, message: 'GitHub username is required' }, { status: 400 });
    }

    // Fetch user details
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!userRes.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch user from GitHub' }, { status: userRes.status });
    }

    const userData = await userRes.json();

    // Fetch up to 100 recent public repositories to aggregate languages
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
      },
      next: { revalidate: 3600 }
    });

    let topLanguages: string[] = [];
    if (reposRes.ok) {
      const repos = await reposRes.json();
      const languageCounts: Record<string, number> = {};
      
      for (const repo of repos) {
        if (repo.language) {
          languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        }
      }

      // Sort by frequency and take top 6
      topLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(entry => entry[0]);
    }

    return NextResponse.json({
      success: true,
      stats: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        public_repos: userData.public_repos,
        public_gists: userData.public_gists,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
        bio: userData.bio,
        company: userData.company,
        location: userData.location,
        top_languages: topLanguages
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
