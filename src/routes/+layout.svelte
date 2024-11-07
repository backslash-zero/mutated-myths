<script context="module" lang="ts">
	import Loading from '$lib/components/loader/Loading.svelte';
	import Footer from '$lib/components/nav/Footer.svelte';
	import MainNav from '$lib/components/nav/MainNav.svelte';
	import { loadMyths, mythsStore } from '$lib/stores/mythsStore';

	// loadMyths() should be called here to ensure that the data is loaded before the page is rendered.
	loadMyths();
	import '../app.css';
</script>

<div class="relative flex flex-col w-[100dwh] h-[100vh]">
	<MainNav />
	<main class="flex-1 w-full overflow-y-scroll flex flex-col gap-4">
		{#if $mythsStore.loading}
			<Loading />
		{:else if $mythsStore.error}
			<p>{$mythsStore.error}</p>
		{:else}
			<slot />
		{/if}
	</main>
	<div class="w-full h-14">
		<Footer />
	</div>
</div>
