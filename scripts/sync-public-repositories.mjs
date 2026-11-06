import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OWNER = 'BezaleelPaul';
const API_ROOT = 'https://api.github.com';
const OUTPUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/github-repositories.json');
const TEMP_OUTPUT = `${OUTPUT}.tmp`;
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'bezaleelpaul-portfolio-public-repository-sync',
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

function validateRepository(repo) {
  return (
    repo &&
    Number.isInteger(repo.id) &&
    typeof repo.name === 'string' &&
    typeof repo.full_name === 'string' &&
    typeof repo.html_url === 'string' &&
    typeof repo.private === 'boolean' &&
    repo.owner?.login?.toLowerCase() === OWNER.toLowerCase()
  );
}

function normalizeRepository(repo) {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description ?? null,
    html_url: repo.html_url,
    homepage: repo.homepage ?? null,
    language: repo.language ?? null,
    stargazers_count: Number.isInteger(repo.stargazers_count) ? repo.stargazers_count : 0,
    forks_count: Number.isInteger(repo.forks_count) ? repo.forks_count : 0,
    watchers_count: Number.isInteger(repo.watchers_count) ? repo.watchers_count : 0,
    topics: Array.isArray(repo.topics) ? repo.topics.filter((topic) => typeof topic === 'string') : [],
    fork: Boolean(repo.fork),
    archived: Boolean(repo.archived),
    default_branch: typeof repo.default_branch === 'string' ? repo.default_branch : 'main',
    updated_at: typeof repo.updated_at === 'string' ? repo.updated_at : null,
    license: repo.license?.spdx_id ?? null,
  };
}

async function fetchAllPublicRepositories() {
  const all = [];
  for (let page = 1; page <= 20; page += 1) {
    const url = new URL(`${API_ROOT}/users/${OWNER}/repos`);
    url.searchParams.set('type', 'owner');
    url.searchParams.set('sort', 'updated');
    url.searchParams.set('direction', 'desc');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));

    const response = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${await response.text()}`);
    }

    const batch = await response.json();
    if (!Array.isArray(batch) || !batch.every(validateRepository)) {
      throw new Error(`GitHub returned an invalid repository payload on page ${page}`);
    }

    // Explicitly exclude private repositories even when the API token can see them.
    all.push(...batch.filter((repo) => repo.private === false).map(normalizeRepository));
    if (batch.length < 100) break;
    if (page === 20) throw new Error('Repository pagination exceeded the safety limit of 2,000 entries');
  }

  const unique = [...new Map(all.map((repo) => [repo.id, repo])).values()];
  return unique.sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''));
}

async function main() {
  try {
    const repositories = await fetchAllPublicRepositories();
    const payload = {
      owner: OWNER,
      generatedAt: new Date().toISOString(),
      count: repositories.length,
      repositories,
    };

    // Atomic replacement: a failed fetch/validation never destroys the last good snapshot.
    writeFileSync(TEMP_OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    renameSync(TEMP_OUTPUT, OUTPUT);
    console.log(`Synced ${repositories.length} public repositories for ${OWNER}.`);
  } catch (error) {
    if (existsSync(OUTPUT)) {
      const previous = JSON.parse(readFileSync(OUTPUT, 'utf8'));
      if (previous && Array.isArray(previous.repositories)) {
        console.warn(`Public repository sync failed; keeping last-good snapshot: ${error.message}`);
        process.exitCode = 0;
        return;
      }
    }
    console.error(`Public repository sync failed and no valid snapshot exists: ${error.message}`);
    process.exitCode = 1;
  }
}

await main();
