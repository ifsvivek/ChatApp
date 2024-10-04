<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleFileChange(event) {
		const file = event.target.files[0];
		if (file) {
			dispatch('imageSelected', file);
		}
	}
</script>

<label
	for="image-upload"
	class="cursor-pointer bg-primary-500 text-white p-3 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center justify-center"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</svg>
	<span class="sr-only">Upload image</span>
</label>
<input type="file" id="image-upload" accept="image/*" class="hidden" on:change={handleFileChange} />
