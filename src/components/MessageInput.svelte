<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let message = '';

	function handleSubmit() {
		if (message.trim()) {
			dispatch('sendMessage', message);
			message = '';
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="flex-grow">
	<div class="relative">
		<input
			type="text"
			bind:value={message}
			placeholder="Type your message or use / for commands"
			class="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
		/>
		<button
			type="submit"
			class="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-600 focus:outline-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				transform="rotate(90)"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
				/>
			</svg>
		</button>
	</div>
</form>
