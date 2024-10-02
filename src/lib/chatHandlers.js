import { chat_history, conversation, groq_chat } from './chatSetup.js';
import { handleCommand, handleToolCall } from './commandHandlers.js';
import { saveUploadedImage } from './fileHandlers.js';

export async function handleMessage(io, socket, data) {
  const user_message = data.message;
  if (user_message.startsWith('/')) {
    const command = user_message.slice(1).split(' ')[0];
    await handleCommand(command, user_message, socket);
    return;
  }

  chat_history.addUserMessage(user_message);
  const response = await conversation.invoke({ human_input: user_message });
  chat_history.addAIMessage(response);
  
  if (response.includes('<tool_call>') && response.includes('</tool_call>')) {
    await handleToolCall(response, socket);
    return;
  }
  
  socket.emit('receive_message', { message: response, is_user: false });
}

export async function handleImageUpload(io, socket, data) {
  const filename = await saveUploadedImage(data.image);
  chat_history.addAIMessage('Image uploaded successfully. You can now ask a question about it.');
  socket.emit('image_uploaded', { filename: filename });
  socket.emit('receive_message', {
    message: 'Image uploaded successfully. You can now ask a question about it.',
    is_user: false
  });
}

export async function handleImageAnalysis(io, socket, data) {
  const { filename, question } = data;
  try {
    const image_data = await getImageData(filename);
    chat_history.addUserMessage(`[Image Analysis] ${question}`);
    const completion = await groq_chat.invoke([
      {
        role: 'user',
        content: [
          { type: 'text', text: question },
          {
            type: 'image_url',
            image_url: { url: `data:image/png;base64,${image_data}` }
          }
        ]
      }
    ]);

    const analysis = completion.content;
    chat_history.addAIMessage(analysis);

    const formatted_response = `Question: ${question}\n\nAnalysis: ${analysis}`;
    socket.emit('receive_message', { message: formatted_response, is_user: false });
  } catch (error) {
    const error_message = `An error occurred while analyzing the image: ${error.message}`;
    chat_history.addAIMessage(error_message);
    socket.emit('receive_message', { message: error_message, is_user: false });
  }
}

export async function handleGuess(io, socket, data) {
  const secret_number = Math.floor(Math.random() * 10) + 1;
  const guess = parseInt(data.guess);
  let result;
  if (guess === secret_number) {
    result = 'Congratulations! You guessed the correct number.';
  } else {
    result = `Sorry, that's not correct. The number was ${secret_number}.`;
  }
  chat_history.addUserMessage(`[Guess] ${guess}`);
  chat_history.addAIMessage(result);
  socket.emit('receive_message', { message: result, is_user: false });
}