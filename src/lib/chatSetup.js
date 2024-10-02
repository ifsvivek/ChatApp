import { ChatGroq, ChatMessageHistory, ConversationBufferWindowMemory } from 'some-chat-library';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const model_name = 'mixtral-8x7b-32768';

const groq_chat = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: model_name,
    temperature: 0.7,
    maxTokens: 1024
});

const chat_history = new ChatMessageHistory();
const conversation_memory = new ConversationBufferWindowMemory({
    k: 10,
    returnMessages: true,
    memoryKey: 'chat_history',
    chatHistory: chat_history
});

export { groq_chat, chat_history, conversation_memory };