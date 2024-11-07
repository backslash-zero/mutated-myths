import { writable } from 'svelte/store';
import type { Myth, MythCreator } from '$types/myth';
import { isError } from '../utils';

const mythNumbers = [1, 2, 3, 4]; // List of myth numbers\

const mythCreators: Array<MythCreator> = [
	{
		name: 'Lilli',
		url: 'https://example.com/creator1'
	},
	{
		name: 'Célestin',
		url: 'https://celest.in'
	},
	{
		name: 'Eman',
		url: 'https://example.com/creator3'
	},
	{
		name: 'Pierre-Louis',
		url: 'https://example.com/creator4'
	}
];

type commits = {
	old: string;
	new: string;
};

const commitsToSkip: string[] = ['first commit', 'reset of the myths'];
const commitsToEdit: commits[] = [
	{ old: 'simplified the myths and added vs code workspace', new: 'Initial commit' }
];

// Define the shape of the store
type MythsStore = {
	myths: Myth[];
	loading: boolean;
	error: string | null;
};

// Initial state of the store
const initialState: MythsStore = {
	myths: mythNumbers.map((index) => ({
		versions: [],
		creator: mythCreators[index - 1]
	})),
	loading: true,
	error: null
};

// Create a writable store with the initial state
const mythsStore = writable<MythsStore>(initialState);

async function fetchAllCommits(
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

async function fetchFileContent(
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

async function fetchMythContent(
	owner: string,
	repo: string,
	commitSha: string,
	mythNumber: number
): Promise<string> {
	const filePath = `Myths/Myth${mythNumber}.txt`;
	return await fetchFileContent(owner, repo, commitSha, filePath);
}

async function fetchMythemeContent(
	owner: string,
	repo: string,
	commitSha: string,
	mythNumber: number
): Promise<string[]> {
	const filePath = `Myths/Mythemes${mythNumber}.txt`;
	const content = await fetchFileContent(owner, repo, commitSha, filePath);
	return content.split('\n').filter((line) => line.trim() !== '');
}

// filter out the myths that have the same commit message
// if a message is
function filterMyths(myths: Myth[]): Myth[] {
	return myths.map((myth) => {
		let versions = myth.versions.filter(
			(version, index, versions) =>
				!commitsToSkip.includes(version.message) &&
				versions.findIndex((v) => v.message === version.message) === index &&
				!version.message.startsWith('adjust')
		);
		// edit the commit message
		versions = versions.map((version) => {
			const commit = commitsToEdit.find((c) => c.old === version.message);
			if (commit) {
				version.message = commit.new;
			}
			return version;
		});
		return { ...myth, versions };
	});
}

async function createMythsData(owner: string, repo: string): Promise<Myth[]> {
	const commits = await fetchAllCommits(owner, repo);

	// Initialize an empty array to hold the myths
	let myths: Myth[] = mythNumbers.map((_, index) => ({
		versions: [],
		creator: mythCreators[index]
	}));

	// reverse the order of commits
	commits.reverse();

	// Fetch data for each commit
	for (const [index, commit] of commits.entries()) {
		const mythContentsPromises = mythNumbers.map((mythNumber) =>
			fetchMythContent(owner, repo, commit.sha, mythNumber)
		);
		const mythemeContentsPromises = mythNumbers.map((mythNumber) =>
			fetchMythemeContent(owner, repo, commit.sha, mythNumber)
		);

		// Wait for all promises to resolve
		const mythContents = await Promise.all(mythContentsPromises);
		const mythemeContents = await Promise.all(mythemeContentsPromises);

		// Populate the myths with data
		mythNumbers.forEach((mythNumber, i) => {
			myths[mythNumber - 1].versions.push({
				myth: mythContents[i],
				message: commit.commit.message,
				sha: commit.sha,
				version: index,
				date: commit.commit.author.date,
				mythemes: mythemeContents[i]
			});
		});
	}

	myths = filterMyths(myths);
	console.log(myths);

	return myths;
}

async function loadMyths() {
	mythsStore.update((state) => ({ ...state, loading: true, error: null }));
	try {
		const myths = await createMythsData('backslash-zero', 'MythGame');
		mythsStore.set({ myths, loading: false, error: null });
	} catch (error) {
		console.error(error);
		mythsStore.update((state) => ({
			...state,
			loading: false,
			error: isError(error) ? error.message : 'An error occurred'
		}));
	}
}

export { loadMyths, mythsStore, type MythsStore };
