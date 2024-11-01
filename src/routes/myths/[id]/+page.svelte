<script lang="ts">
	import { page } from '$app/stores';
	import { mythsStore } from '$lib/stores/mythsStore';
	import type { Myth } from '$types/myth';
	import { get } from 'svelte/store';

	const id: number = parseInt($page.params.id.replace('Myth', ''));
	let myth: Myth | null = null;
	let currentMythVersion: number = 0;
	let totalversions: number = 0;
	let loading = true;

	mythsStore.subscribe((myths) => {
		myth = $mythsStore.myths[id - 1];
		// default to the latest version
		currentMythVersion = $mythsStore.myths[id - 1].versions.length - 1;
		console.log('myth', myth);
		console.log('currentMythVersion', currentMythVersion);
		console.log('myth.versions[currentMythVersion]', myth.versions[currentMythVersion]);
		loading = get(mythsStore).loading;
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
		<div class="h-full w-full flex flex-col p-8 max-w-screen-2xl">
			<div class="flex gap-16">
				<div class="flex-1 text-4xl leading-snug">
					<p>{myth.versions[currentMythVersion].myth}</p>
				</div>
				<div class="w-1/4 text-md flex flex-col gap-8">
					<div class="font-mono">
						<div class="flex items-center">
							<h3 class="font-Celescript text-5xl">Infos</h3>
							<div class="w-20 flex h-16 items-center font-Celescript text-2xl">
								<button
									class="flex-1 h-full flex items-center justify-center"
									on:click={decreaseIndex}>-</button
								>
								<button
									class="flex-1 h-fullflex items-center justify-center"
									on:click={increaseIndex}>+</button
								>
							</div>
						</div>
						<p>id: {id}</p>
						<p>total versions: {currentMythVersion + 1} / {totalversions}</p>

						<p>{myth.creator.name}</p>
						<p>{myth.versions[currentMythVersion].sha}</p>
						<p>{myth.versions[currentMythVersion].date}</p>
						<p>{myth.versions[currentMythVersion].message}</p>
					</div>
					<div class="font-mono flex flex-col gap-4">
						<h3 class="font-Celescript text-5xl">Mythemes</h3>
						{#each myth.versions[currentMythVersion].mythemes as mytheme}
							<p>{mytheme}</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
