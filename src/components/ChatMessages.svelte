<script>
	export let messages = [];
</script>

<div class="space-y-4 p-4">
	{#each messages as message}
		<div class="flex {message.isUser ? 'justify-end' : 'justify-start'}">
			<div
				class="max-w-[80%] p-3 rounded-lg {message.isUser
					? 'bg-primary-100 dark:bg-primary-900'
					: 'bg-gray-200 dark:bg-gray-700'}"
			>
				<div class="prose dark:prose-invert max-w-none">
					{@html message.text}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	:global(.prose) {
		@apply text-sm;
	}
	:global(.prose h1) {
		@apply text-xl font-bold mb-2;
	}
	:global(.prose h2) {
		@apply text-lg font-bold mb-2;
	}
	:global(.prose h3) {
		@apply text-base font-bold mb-2;
	}
	:global(.prose p) {
		@apply mb-2;
	}
	:global(.prose ul, .prose ol) {
		@apply ml-4 mb-2;
	}
	:global(.prose li) {
		@apply mb-1;
	}
	:global(.prose code) {
		@apply bg-gray-100 dark:bg-gray-800 px-1 rounded;
	}
	:global(.prose pre) {
		@apply bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 overflow-x-auto;
	}
	:global(.prose img) {
		@apply max-w-full h-auto rounded-lg mt-2;
	}
</style>
