# AI Chat Assistant 🤖

A powerful Flask-based web application featuring an AI chat assistant powered by Groq's LLaMA 3.3 70B model. The application provides a rich, interactive chat experience with multiple capabilities including image analysis, games, and more.

## ✨ Features

### 🧠 AI Conversation
- Powered by Groq's LLaMA 3.3 70B Versatile model
- Context-aware conversations with memory (remembers last 10 messages)
- Markdown-formatted responses for better readability
- Dark/Light theme toggle for comfortable viewing

### 🖼️ Image Capabilities
- **Image Upload & Analysis**: Upload images and ask questions about them using LLaMA Vision model

### 🎵 Entertainment
- **Music Playback**: Play music from YouTube (via commands)
- **Random Images**: Fetch random cat pictures on demand

### 🎮 Games & Fun
- **Guess the Number**: Number guessing game (1-10)
- **Dice Roll**: Roll dice with customizable sides
- **Coin Flip**: Flip a virtual coin
- **Magic 8-Ball**: Get yes/no/maybe answers to questions

### 🧮 Utilities
- Real-time chat with Socket.IO
- Responsive design that works on all devices

## 📋 Requirements

### Python Version
- Python 3.8 or higher

### Dependencies (Latest Versions)
- Flask 3.1.2
- Flask-SocketIO 5.5.1
- python-dotenv 1.2.1
- requests 2.32.5
- Pillow 12.0.0
- markdown 3.10
- langchain 1.1.3
- langchain-core 1.2.0
- langchain-groq 1.1.1
- langchain-community 0.4.1
- groq 0.37.1

## 🚀 Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/ifsvivek/ChatApp
    cd ChatApp
    ```

2. **Create a virtual environment:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    ```

3. **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Set up the environment variables:**
    - Copy the `.env.example` file to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Fill in the required API keys in the `.env` file (see Configuration section below)

## ⚙️ Configuration

Create a `.env` file in the root directory with the following API key:

```env
GROQ_API_KEY=<your_groq_api_key>
```

### How to get API keys:

- **GROQ_API_KEY**: Get your free API key from [Groq Console](https://console.groq.com/)

## 🎯 Usage

1. **Run the application:**
    ```bash
    python app.py
    ```
    Or using Flask directly:
    ```bash
    flask run --port 8080
    ```

2. **Access the application:**
    Open your web browser and navigate to `http://127.0.0.1:8080`

## 💬 Available Commands

Commands can be used by prefixing them with `/` in the chat:

| Command | Description | Example |
|---------|-------------|---------|
| `/cat` | Get a random cat image | `/cat` |
| `/gtn` | Start a guess-the-number game | `/gtn` |
| `/dice [sides]` | Roll a dice (default 6 sides) | `/dice 20` |
| `/flip` | Flip a coin | `/flip` |
| `/ask [question]` | Get a yes/no/maybe answer | `/ask Will it rain today?` |
| `/play [query]` | Play music from YouTube | `/play Never Gonna Give You Up` |
| `/stop` | Stop music playback | `/stop` |

## 🏗️ Project Structure

```
ChatApp/
├── app.py                 # Main application file
├── requirements.txt       # Python dependencies
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── templates/
│   └── index.html        # Main chat interface
└── uploads/              # Uploaded images storage
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Follow PEP 8 style guide for Python code
- Add comments for complex logic
- Test your changes thoroughly before submitting
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for the powerful LLaMA models
- [Flask](https://flask.palletsprojects.com/) and [Socket.IO](https://socket.io/) for the web framework
- [LangChain](https://www.langchain.com/) for LLM orchestration

## 🐛 Known Issues

- Music playback functionality is a placeholder and needs implementation
- Game state in "Guess the Number" doesn't persist between sessions

## 🔮 Future Enhancements

- [ ] Add user authentication
- [ ] Implement persistent chat history
- [ ] Add more AI models support
- [ ] Add voice input/output capabilities
- [ ] Implement chat export functionality

---

Built with ❤️ using Flask and AI
