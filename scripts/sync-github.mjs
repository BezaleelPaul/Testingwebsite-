#!/usr/bin/env node

/**
 * Automated GitHub Repository Synchronization Script
 * Fetches public repositories, metadata, and recent commit activity for BezaleelPaul
 * and outputs validated JSON to src/data/syncedProfile.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = 'BezaleelPaul';
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'syncedProfile.json');

async function syncGitHubData() {
  console.log(`[GitHub Sync] Starting synchronization for user: ${GITHUB_USERNAME}`);
  
  const headers = {
    'User-Agent': 'BezForge-Portfolio-Sync',
    'Accept': 'application/vnd.github.v3+json',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    console.log('[GitHub Sync] Authenticated with GITHUB_TOKEN');
  }

  try {
    // 1. Fetch User Profile
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
    if (!userRes.ok) {
      throw new Error(`Failed to fetch user profile: ${userRes.status} ${userRes.statusText}`);
    }
    const userData = await userRes.json();

    // 2. Fetch Public Repositories (sorted by updated)
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers });
    if (!reposRes.ok) {
      throw new Error(`Failed to fetch repositories: ${reposRes.status} ${reposRes.statusText}`);
    }
    const repos = await reposRes.json();

    // 3. Process Top Repositories
    const processedRepos = repos
      .filter((r) => !r.fork)
      .slice(0, 10)
      .map((r) => ({
        name: r.name,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language || 'Unknown',
        description: r.description || 'No description provided.',
        url: r.html_url,
        updatedAt: r.updated_at,
        topics: r.topics || [],
      }));

    // 4. Fetch Recent Public Events
    const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=20`, { headers });
    const events = eventsRes.ok ? await eventsRes.json() : [];

    const activityFeed = events.slice(0, 8).map((e) => {
      let action = 'Contributed to';
      let emoji = '📦';
      if (e.type === 'PushEvent') {
        action = `Pushed ${e.payload.size || 1} commit(s) to`;
        emoji = '📦';
      } else if (e.type === 'CreateEvent') {
        action = `Created ${e.payload.ref_type} in`;
        emoji = '🌿';
      } else if (e.type === 'PullRequestEvent') {
        action = `${e.payload.action} PR in`;
        emoji = '🔀';
      } else if (e.type === 'ForkEvent') {
        action = 'Forked repository';
        emoji = '🍴';
      }
      return {
        emoji,
        action,
        repo: e.repo ? e.repo.name.split('/')[1] || e.repo.name : 'repository',
        time: new Date(e.created_at).toLocaleDateString(),
      };
    });

    const payload = {
      generatedAt: new Date().toISOString(),
      user: {
        login: userData.login,
        name: userData.name || 'Bezaleel Paul N',
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        bio: userData.bio,
      },
      topRepositories: processedRepos,
      recentActivity: activityFeed,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    console.log(`[GitHub Sync] Successfully updated ${OUTPUT_FILE} (${processedRepos.length} repos synced)`);
  } catch (error) {
    console.error(`[GitHub Sync Warning] ${error.message}`);
    console.log('[GitHub Sync] Falling back to existing cached profile dataset.');
  }
}

syncGitHubData();
