<script>
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import { fade } from 'svelte/transition';

	let socket;
	let messages = [];
	let inputMessage = '';
	let uploadedImageFilename = null;
	let typingIndicator = false;
	let isDarkMode = false;

	const commands = [
		{ name: 'cat', description: 'Get a random cat image' },
		{ name: 'dog', description: 'Get a random dog image' },
		{ name: 'imagine', description: 'Generate an image based on a prompt' },
		{ name: 'gtn', description: 'Play Guess the Number game' },
		{ name: 'dice', description: 'Roll a dice' },
		{ name: 'flip', description: 'Flip a coin' },
		{ name: 'ask', description: 'Ask a yes/no question' },
		{ name: 'play', description: 'Play music from YouTube' },
		{ name: 'stop', description: 'Stop music playback' }
	];

	let filteredCommands = [];

	onMount(() => {
		socket = io({
			path: '/api/socketio'
		});

		socket.on('connect', () => {
			console.log('Connected to server');
		});

		socket.on('receive_message', (data) => {
			messages = [...messages, { text: data.message, isUser: data.is_user }];
			typingIndicator = false;
		});

		socket.on('receive_image', (data) => {
			messages = [...messages, { imageUrl: data.url, isUser: false }];
		});

		socket.on('image_uploaded', (data) => {
			uploadedImageFilename = data.filename;
			messages = [
				...messages,
				{ text: 'Image uploaded successfully. You can now ask a question about it.', isUser: false }
			];
		});

		socket.on('guess', (data) => {
			const guess = prompt('Enter your guess (1-10):');
			if (guess) {
				socket.emit('guess', { guess: parseInt(guess) });
			}
		});

		// Check for saved theme preference or use system preference
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
			isDarkMode = true;
		}
	});

	function sendMessage() {
		if (inputMessage.trim()) {
			messages = [...messages, { text: inputMessage, isUser: true }];
			typingIndicator = true;

			if (uploadedImageFilename) {
				socket.emit('analyze_image', { filename: uploadedImageFilename, question: inputMessage });
				uploadedImageFilename = null;
			} else {
				socket.emit('send_message', { message: inputMessage });
			}

			inputMessage = '';
		}
	}

	function handleImageUpload(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				socket.emit('upload_image', { image: e.target.result });
			};
			reader.readAsDataURL(file);
		}
	}

	function toggleTheme() {
		isDarkMode = !isDarkMode;
		document.documentElement.classList.toggle('dark');
		localStorage.theme = isDarkMode ? 'dark' : 'light';
	}

	$: {
		if (inputMessage.startsWith('/')) {
			const searchTerm = inputMessage.slice(1).toLowerCase();
			filteredCommands = commands.filter((cmd) => cmd.name.includes(searchTerm));
		} else {
			filteredCommands = [];
		}
	}

	function selectCommand(command) {
		inputMessage = `/${command.name} `;
		filteredCommands = [];
	}
</script>

<div
	class="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col min-h-screen"
>
	<div class="container mx-auto p-4 flex flex-col flex-grow">
		<header class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold text-primary-600 dark:text-primary-400">AI Chat Assistant</h1>
			<button
				on:click={toggleTheme}
				class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
			</button>
		</header>
		<div
			class="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 space-y-4"
		>
			{#each messages as message}
				<div
					class="p-3 rounded-lg {message.isUser
						? 'bg-primary-100 dark:bg-primary-900 ml-auto'
						: 'bg-gray-200 dark:bg-gray-700'} max-w-[80%]"
					transition:fade
				>
					{#if message.text}
						<p class={message.isUser ? 'text-right' : ''}>{message.text}</p>
					{:else if message.imageUrl}
						<img
							src={message.imageUrl}
							alt="Generated or uploaded image"
							class="max-w-full h-auto rounded-lg mt-2"
						/>
					{/if}
				</div>
			{/each}
		</div>
		<form on:submit|preventDefault={sendMessage} class="flex gap-4 items-end">
			<div class="flex-grow relative">
				<label for="message-input" class="sr-only">Type your message</label>
				<input
					type="text"
					id="message-input"
					bind:value={inputMessage}
					placeholder="Type your message or use / for commands"
					class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
				/>
				{#if filteredCommands.length > 0}
					<div
						class="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2 max-h-60 overflow-y-auto z-10 shadow-lg w-full"
					>
						{#each filteredCommands as command}
							<div
								on:click={() => selectCommand(command)}
								class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
							>
								/{command.name} - {command.description}
							</div>
						{/each}
					</div>
				{/if}
			</div>
			<label
				for="image-upload"
				class="cursor-pointer bg-primary-500 text-white p-3 rounded-lg hover:bg-primary-600 transition-colors duration-300"
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
			<input
				type="file"
				id="image-upload"
				accept="image/*"
				class="hidden"
				on:change={handleImageUpload}
			/>
			<button
				type="submit"
				class="bg-primary-500 text-white p-3 rounded-lg hover:bg-primary-600 transition-colors duration-300"
				>Send</button
			>
		</form>
		{#if typingIndicator}
			<div class="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
				<span>AI is typing</span>
				<div class="flex space-x-1">
					<div class="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"></div>
					<div
						class="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"
						style="animation-delay: 0.2s"
					></div>
					<div
						class="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"
						style="animation-delay: 0.4s"
					></div>
				</div>
			</div>
		{/if}
	</div>
</div>
