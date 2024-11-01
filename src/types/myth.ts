export type MythVersion = {
	// The myth string is the content of the text file at Myths/Myth-X.text
	myth: string;
	// The myth message, is the content of the commit
	message: string;
	// The myth sha, is the commit sha
	sha: string;
	// The myth version is the index of the commit
	version: number;
	// The myth date is the commit date
	date: string;
	// The mythemes are backspace seperated strings is the content of the text file at Myths/Mytheme-X.text
	mythemes: string[];
};

export type MythCreator = {
	// Values are hardcorded in the lib/myths.ts file
	name: string;
	url: string;
};

export type Myth = {
	versions: MythVersion[];
	creator: MythCreator;
};
