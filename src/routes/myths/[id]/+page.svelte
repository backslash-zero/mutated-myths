<script lang="ts">
	import { page } from '$app/stores';
	import { mythsStore } from '$lib/stores/mythsStore';
	import type { Myth } from '$types/myth';
	import { get } from 'svelte/store';

	let id: number = 1;
	let myth: Myth | null = null;
	let currentMythVersion: number = 0;
	let totalversions: number = 0;
	let loading = true;

	page.subscribe((value) => {
		if (!value.params.id?.includes('Myth')) return;
		id = parseInt(value.params.id.replace('Myth', ''));
		myth = $mythsStore.myths[id - 1];
		// default to the latest version
		currentMythVersion = myth?.versions?.length - 1;
		loading = $mythsStore.loading;
		totalversions = myth.versions.length;
	});

	mythsStore.subscribe(() => {
		myth = $mythsStore.myths[id - 1];
		// default to the latest version
		currentMythVersion = myth?.versions?.length - 1;

		loading = $mythsStore.loading;
		totalversions = myth.versions.length;
	});
	const increaseIndex = () => {
		if (currentMythVersion < totalversions - 1) {
			currentMythVersion++;
		} else currentMythVersion = 0;
	};
	const decreaseIndex = () => {
		if (currentMythVersion > 0) {
			currentMythVersion--;
		} else currentMythVersion = totalversions - 1;
	};
</script>

<!-- <h1>Myth</h1> -->
{#if !loading && myth !== null}
	<!-- content here -->
	<div class="h-full w-full flex items-center justify-center">
		<div class="h-full w-full flex flex-col p-2 md:p-8 max-w-screen-2xl">
			<div class="flex flex-col-reverse md:flex-row gap-16">
				<div class="flex-1 text-2xl pb-8 md:text-4xl">
					<p>{myth.versions[currentMythVersion].myth}</p>
				</div>
				<div class="w-full md:w-80 text-md flex flex-col gap-8">
					<div class="font-mono text-sm">
						<div class="flex items-center justify-between">
							<h3 class="font-Celescript text-5xl">Infos</h3>
							<div class="w-24 flex h-16 items-center font-Celescript text-4xl">
								<button
									class="flex-1 h-full flex items-center justify-center"
									on:click={decreaseIndex}>-</button
								>
								<p></p>
								<button
									class="flex-1 h-fullflex items-center justify-center"
									on:click={increaseIndex}>+</button
								>
							</div>
						</div>
						<p>id: {id} - {myth.creator.name}</p>
						<p>version: {currentMythVersion + 1} / {totalversions}</p>
						<p>{myth.versions[currentMythVersion].date}</p>
						<p>{myth.versions[currentMythVersion].sha}</p>
						<p>{myth.versions[currentMythVersion].message}</p>
					</div>
					<div class="w-full font-mono flex flex-col gap-4 text-sm">
						<h3 class="font-Celescript text-5xl">Mythemes</h3>
						{#each myth.versions[currentMythVersion].mythemes as mytheme}
							<p class="w-full">{mytheme}</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
