<script>
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { ChatMessages, ImageUpload, MessageInput, ThemeToggle } from '$components';

	let messages = [];
	let uploadedImageFilename = null;
	let isTyping = false;
	let chatContainer;

	function addMessage(message, isUser) {
		messages = [...messages, { text: marked.parse(message), isUser }];
		scrollToBottom();
	}

	function scrollToBottom() {
		setTimeout(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 0);
	}

	async function sendMessage(message) {
		addMessage(message, true);
		isTyping = true;

		const formData = new FormData();
		formData.append('message', message);

		try {
			const response = await fetch('?/sendMessage', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			console.log(result);

			isTyping = false;

			if (result && result.data) {
				const parsedMessage = JSON.parse(result.data)[0];
				addMessage(parsedMessage, false);
			} else {
				addMessage("Sorry, I couldn't process that message.", false);
			}
		} catch (error) {
			console.error('Error sending message:', error);
			isTyping = false;
			addMessage('Sorry, there was an error processing your message.', false);
		}
	}

	async function handleImageUpload(file) {
		const formData = new FormData();
		formData.append('image', file);

		try {
			const response = await fetch('?/uploadImage', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			if (result.success) {
				uploadedImageFilename = result.filename;
				addMessage(
					`Image uploaded successfully. You can now ask a question about it.\n\n![Uploaded Image](/uploads/${result.filename})`,
					false
				);
			}
		} catch (error) {
			console.error('Error uploading image:', error);
			addMessage('Sorry, there was an error uploading the image.', false);
		}
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (
			savedTheme === 'dark' ||
			(!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		}
	});
</script>

<div
	class="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col min-h-screen"
>
	<div class="container mx-auto p-4 flex flex-col flex-grow max-w-4xl">
		<header class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold text-primary-600 dark:text-primary-400">AI Chat Assistant</h1>
			<ThemeToggle />
		</header>
		<div
			bind:this={chatContainer}
			class="flex-grow overflow-y-auto mb-4 rounded-lg bg-white dark:bg-gray-800 shadow-md"
		>
			<ChatMessages {messages} />
			{#if isTyping}
				<div class="flex items-center gap-2 p-4 text-gray-600 dark:text-gray-400">
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
		<div class="flex gap-4 items-end">
			<MessageInput on:sendMessage={(e) => sendMessage(e.detail)} />
			<ImageUpload on:imageSelected={(e) => handleImageUpload(e.detail)} />
		</div>
	</div>
</div>
