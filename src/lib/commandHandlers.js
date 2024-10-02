import { getCatImage, getDogImage, generateImage, calculate, guessTheNumber, rollDice, flipCoin, askQuestion, getLyrics, playMusic, stopMusic } from './commands.js';

export async function handleCommand(command, message, socket) {
    const commands = {
        cat: getCatImage,
        dog: getDogImage,
        imagine: (args) => generateImage(args, socket),
        calculate: (args) => calculate(args, socket),
        gtn: () => guessTheNumber(socket),
        dice: (args) => rollDice(args, socket),
        flip: () => flipCoin(socket),
        ask: (args) => askQuestion(args, socket),
        lyrics: (args) => getLyrics(args, socket),
        play: (args) => playMusic(args, socket),
        stop: () => stopMusic(socket)
    };

    if (command in commands) {
        await commands[command](message);
    } else {
        socket.emit('receive_message', { message: `Unknown command: ${command}`, is_user: false });
    }
}

export async function handleToolCall(response, socket) {
    const start = response.indexOf('<tool_call>') + '<tool_call>'.length;
    const end = response.indexOf('</tool_call>');
    const tool_call_json = response.substring(start, end).trim();

    try {
        const tool_call = JSON.parse(tool_call_json);
        const { name, arguments: args } = tool_call;
        await handleCommand(name, args, socket);
    } catch (error) {
        socket.emit('receive_message', { message: `Error handling tool call: ${error.message}`, is_user: false });
    }
}