import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const repositories = [
  { projectId: 'celestial-observatory-3d', repo: 'bezaleelpaul.github.io' },
  { projectId: 'nadicare-twin-engine', repo: 'bnmit-nadicare-health' },
  { projectId: 'file-organizer-ecosystem', repo: 'file_organizer_flutter' },
  { projectId: 'bescom-calculator', repo: 'BESCOM-Calculator' },
  { projectId: 'drishti-ai', repo: 'Drishti-AI' },
];

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'bezaleel-work-atlas',
};

const MAX_STARS = 14;
const excludedMessages = [
  /^chore: sync portfolio site/i,
  /^Merge /i,
  /^style: apply dart format/i,
];

const fetchJson = async (url) => {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
};

const totalFromLink = async (linkHeader, pageCount, repo) => {
  if (!linkHeader) return pageCount;
  const match = linkHeader.match(/[?&]page=(\d+)>; rel="last"/);
  if (!match) return pageCount;

  const lastPage = Number(match[1]);
  if (!Number.isFinite(lastPage) || lastPage <= 1) return pageCount;

  const lastPageResponse = await fetchJson(
    `https://api.github.com/repos/BezaleelPaul/${repo}/commits?per_page=100&page=${lastPage}`
  );
  const lastPageCommits = await lastPageResponse.json();
  return (lastPage - 1) * 100 + lastPageCommits.length;
};

const sampleEvenly = (items, limit) => {
  if (items.length <= limit) return items;
  const selected = [];
  const step = (items.length - 1) / (limit - 1);
  for (let index = 0; index < limit; index += 1) {
    const item = items[Math.round(index * step)];
    if (!selected.some((existing) => existing.sha === item.sha)) selected.push(item);
  }
  return selected;
};

const build = async () => {
  const constellations = [];

  for (const repository of repositories) {
    const repoResponse = await fetchJson(`https://api.github.com/repos/BezaleelPaul/${repository.repo}`);
    const repo = await repoResponse.json();

    const commitResponse = await fetchJson(
      `https://api.github.com/repos/BezaleelPaul/${repository.repo}/commits?per_page=100`
    );
    const commits = await commitResponse.json();
    const totalCommits = await totalFromLink(
      commitResponse.headers.get('link'),
      commits.length,
      repository.repo
    );

    const ordered = commits
      .filter((commit) => commit?.commit?.author?.date)
      .slice()
      .reverse()
      .map((commit) => ({
        sha: commit.sha.slice(0, 7),
        date: commit.commit.author.date,
        message: commit.commit.message.split('\n')[0].trim().slice(0, 110),
        url: commit.html_url,
      }))
      .filter((commit) => !excludedMessages.some((pattern) => pattern.test(commit.message)));

    const stars = sampleEvenly(ordered, MAX_STARS);

    constellations.push({
      projectId: repository.projectId,
      repo: repo.name,
      createdAt: repo.created_at,
      pushedAt: repo.pushed_at,
      htmlUrl: repo.html_url,
      stars,
      observedCommits: commits.length,
      totalCommits,
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    constellations,
  };

  const target = path.join(process.cwd(), 'src', 'data', 'workAtlas.generated.json');
  await writeFile(target, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${constellations.length} constellations to ${target}`);
};

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
