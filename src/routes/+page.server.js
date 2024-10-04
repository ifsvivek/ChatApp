import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { BufferMemory } from 'langchain/memory';
import lyricsgenius from 'genius-lyrics';
import { GENIUS_TOKEN, GROQ_API_KEY } from '$env/static/private';
import { writeFile } from 'fs/promises';
import path from 'path';

const model = new ChatGroq({
	apiKey: GROQ_API_KEY,
	model: 'llama-3.2-90b-text-preview',
	temperature: 0.7,
	maxTokens: 1000,
	topP: 1
});

const memory = new BufferMemory({
	returnMessages: true,
	memoryKey: 'chat_history'
});

const prompt = ChatPromptTemplate.fromMessages([
	[
		'system',
		`You are a helpful AI assistant designed to chat with users and provide information on various topics.
    You use Markdown formatting to structure your responses, including headers, lists, and code blocks when appropriate.
    You aim to be friendly, informative, and engaging in your conversations.
    You can perform various functions like generating images, fetching cat and dog pictures, playing music from YouTube, fetching lyrics, and more.
    You can also analyze uploaded images and answer questions about them.
    You can play games like guessing numbers, rolling dice, and flipping coins.
    You remember to have fun and use emojis but don't overdo it.`
	],
	new MessagesPlaceholder('chat_history'),
	['human', '{input}']
]);

const chain = RunnableSequence.from([
	{
		input: (initialInput) => initialInput.input,
		chat_history: async () => {
			const memoryResult = await memory.loadMemoryVariables({});
			return memoryResult.chat_history || [];
		}
	},
	prompt,
	model,
	new StringOutputParser()
]);

export function load() {
	return {};
}

export const actions = {
	sendMessage: async ({ request }) => {
		const data = await request.formData();
		const message = data.get('message');
		const response = await handleMessage(message);
		return response;
	},
	uploadImage: async ({ request }) => {
		const data = await request.formData();
		const image = data.get('image');
		const filename = `uploaded_image_${Date.now()}.png`;
		const filepath = path.join(process.cwd(), 'static', 'uploads', filename);

		const arrayBuffer = await image.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		await writeFile(filepath, buffer);

		return { success: true, filename };
	},
	analyzeImage: async ({ request }) => {
		const data = await request.formData();
		const filename = data.get('filename');
		const question = data.get('question');
		const analysis = await analyzeImage(filename, question);
		return { success: true, message: analysis };
	}
};

async function handleMessage(message) {
	if (message.startsWith('/')) {
		const [command, ...args] = message.slice(1).split(' ');
		return await handleCommand(command, args.join(' '));
	}

	const response = await chain.invoke({ input: message });
	await memory.saveContext({ input: message }, { output: response });
	return response;
}

async function handleCommand(command, args) {
	switch (command) {
		case 'cat':
		case 'dog':
			return await getRandomAnimalImage(command);
		case 'imagine':
			return await generateImage(args);
		case 'lyrics':
			return await getLyrics(args);
		case 'gtn':
			return startGuessTheNumber();
		case 'dice':
			return rollDice(args);
		case 'flip':
			return flipCoin();
		case 'ask':
			return askQuestion(args);
		case 'play':
			return playMusic(args);
		case 'stop':
			return stopMusic();
		default:
			return 'Unknown command';
	}
}

async function getRandomAnimalImage(animal) {
	const response = await fetch(`https://api.the${animal}api.com/v1/images/search`);
	const data = await response.json();
	return `![${animal} image](${data[0].url})`;
}

async function generateImage(prompt) {
	// Placeholder for image generation
	return `Generated image based on prompt: "${prompt}"`;
}

async function getLyrics(songName) {
	const genius = new lyricsgenius.Client(GENIUS_TOKEN);
	try {
		const song = await genius.songs.search(songName);
		if (song.hits.length > 0) {
			const lyrics = await genius.songs.lyrics(song.hits[0].result.id);
			return `## Lyrics for "${song.hits[0].result.title}" by ${song.hits[0].result.artist_names}\n\n${lyrics}`;
		}
		return 'Lyrics not found';
	} catch (error) {
		console.error('Error fetching lyrics:', error);
		return 'An error occurred while fetching lyrics';
	}
}

async function analyzeImage(filename, question) {
	// Placeholder for image analysis
	return `Analysis for ${filename}: ${question}`;
}

function startGuessTheNumber() {
	const secretNumber = Math.floor(Math.random() * 10) + 1;
	return `I'm thinking of a number between 1 and 10. Can you guess it? Use /guess [number] to make a guess.`;
}

function rollDice(args) {
	const sides = parseInt(args) || 6;
	const result = Math.floor(Math.random() * sides) + 1;
	return `You rolled a ${result} on a ${sides}-sided die.`;
}

function flipCoin() {
	return Math.random() < 0.5 ? 'Heads' : 'Tails';
}

function askQuestion(question) {
	const responses = ['Yes', 'No', 'Maybe', 'Definitely', 'Not likely'];
	const randomResponse = responses[Math.floor(Math.random() * responses.length)];
	return `Question: ${question}\nAnswer: ${randomResponse}`;
}

function playMusic(query) {
	return `Playing music: ${query}`;
}

function stopMusic() {
	return 'Music playback stopped.';
}
