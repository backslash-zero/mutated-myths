<script context="module" lang="ts">
	import Loading from '$lib/components/loader/Loading.svelte';
	import Footer from '$lib/components/nav/Footer.svelte';
	import MainNav from '$lib/components/nav/MainNav.svelte';
	import { loadMyths, mythsStore } from '$lib/stores/mythsStore';

	// loadMyths() should be called here to ensure that the data is loaded before the page is rendered.
	loadMyths();
	import '../app.css';
</script>

<div class="relative flex flex-col w-[100dwh] h-[100dvh]">
	<MainNav />
	<main class="h-full w-full p-4 flex flex-col gap-4">
		{#if $mythsStore.loading}
			<Loading />
		{:else}
			<slot />
		{/if}
	</main>
	<Footer />
</div>
