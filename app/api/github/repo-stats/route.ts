import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const repoUrl = searchParams.get('url');

    if (!repoUrl) {
      return NextResponse.json({ success: false, message: 'Repository URL is required' }, { status: 400 });
    }

    // Extract owner and repo from URL (e.g., https://github.com/owner/repo)
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return NextResponse.json({ success: false, message: 'Invalid GitHub URL' }, { status: 400 });
    }

    const owner = match[1];
    let repo = match[2];
    // Remove .git if present
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }

    // Fetch repo details
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!repoRes.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch repository from GitHub' }, { status: repoRes.status });
    }

    const repoData = await repoRes.json();

    // Fetch languages
    const langRes = await fetch(repoData.languages_url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
      },
      next: { revalidate: 3600 }
    });
    
    let languages = {};
    if (langRes.ok) {
      languages = await langRes.json();
    }

    // Fetch commit count (we can approximate using the contributors API or commits API)
    // To get the total commit count efficiently, we can use the contributors API
    const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
      },
      next: { revalidate: 3600 }
    });

    let commitsCount = 0;
    if (commitsRes.ok) {
      const linkHeader = commitsRes.headers.get('link');
      if (linkHeader) {
        // Link: <...page=5>; rel="last"
        const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
        if (lastPageMatch) {
          commitsCount = parseInt(lastPageMatch[1], 10);
        } else {
          commitsCount = 1;
        }
      } else {
        const commits = await commitsRes.json();
        commitsCount = commits.length;
      }
    }

    // Fetch top contributors
    const contribRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
      },
      next: { revalidate: 3600 }
    });

    let topContributors = [];
    if (contribRes.ok) {
      const contributorsData = await contribRes.json();
      topContributors = contributorsData.map((c: any) => ({
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        contributions: c.contributions
      }));
    }

    return NextResponse.json({
      success: true,
      stats: {
        commits: commitsCount,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.subscribers_count,
        languages: Object.keys(languages),
        openIssues: repoData.open_issues_count,
        lastUpdated: repoData.updated_at,
        contributors: topContributors
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
