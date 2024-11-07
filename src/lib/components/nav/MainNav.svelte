<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	// add a logic so that if im on the page of the myth, the link to that page is disabled
	// and the text is bold
	// if im on the home page, the home link is disabled and the text is bold

	// get the current path

	const pages = [
		{ name: 'Home', path: '/' },
		{ name: 'I', path: '/myths/Myth1' },
		{ name: 'II', path: '/myths/Myth2' },
		{ name: 'III', path: '/myths/Myth3' },
		{ name: 'IV', path: '/myths/Myth4' }
	];
</script>

<nav class="w-full h-20 md:h-40 flex items-center bg-slate-300 font-Celescript text-xl md:text-3xl">
	{#each pages as item}
		{#if item.path === $page.url.pathname}
			<a
				href={item.path}
				class="h-full flex-1 flex items-center justify-center hover:bg-slate-100 transition-all bg-white"
				><p>{item.name}</p></a
			>
		{:else}
			<a
				href={item.path}
				class="h-full flex-1 flex items-center justify-center hover:bg-slate-100 transition-all"
				><p>{item.name}</p></a
			>
		{/if}
	{/each}
</nav>
