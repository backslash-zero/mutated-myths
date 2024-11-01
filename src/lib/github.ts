export async function fetchAllCommits(
	owner: string,
	repo: string
): Promise<{ sha: string; commit: { message: string; author: { date: string } } }[]> {
	const response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`
	);
	if (!response.ok) throw new Error('Failed to fetch commits');
	const commits = await response.json();
	return commits;
}
export async function fetchFileContent(
	owner: string,
	repo: string,
	commitSha: string,
	filePath: string
): Promise<string> {
	const response = await fetch(
		`https://raw.githubusercontent.com/${owner}/${repo}/${commitSha}/${filePath}`
	);
	if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
	return await response.text();
}

export async function fetchMythContent(
	owner: string,
	repo: string,
	commitSha: string,
	mythNumber: number
): Promise<string> {
	const filePath = `Myths/Myth-${mythNumber}.txt`;
	return await fetchFileContent(owner, repo, commitSha, filePath);
}

export async function fetchMythemeContent(
	owner: string,
	repo: string,
	commitSha: string,
	mythNumber: number
): Promise<string[]> {
	const filePath = `Myths/Mytheme-${mythNumber}.txt`;
	const content = await fetchFileContent(owner, repo, commitSha, filePath);
	return content.split('\n').filter((line) => line.trim() !== '');
}
