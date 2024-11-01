import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
	// Check that params is a string with a number at the end Myth1, Myth2, etc.
	if (!params.id.match(/^Myth\d+$/)) {
		error(404, 'Not found');
	}
	// Get the last digits of the slug as a number
	const id = parseInt(params.id.replace('Myth', ''));
	console.log('id:', id);
	return {
		props: {
			id
		}
	};
};
