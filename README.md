# CodePulse - Online Code Editor

A fully functional online code editor with support for multiple programming languages, built using HTML, CSS, and JavaScript.

![CodePulse Screenshot](https://via.placeholder.com/800x450.png?text=CodePulse+Online+Code+Editor)

## ⚠️ Demo Notice

This repository includes an API key for **DEMONSTRATION PURPOSES ONLY**. In a real production application, you should:

1. **NEVER** commit API keys to a public repository
2. Use environment variables on your server
3. Use a backend proxy to make API calls securely

The current setup is only meant to showcase the project's functionality.

## Features

- **Modern UI/UX**: Responsive layout, dark/light mode toggle, and intuitive design
- **Multiple File Support**: Create and manage multiple code files
- **Language Support**: Python, JavaScript, Java, C, C++, C#, Ruby, Go, PHP
- **Code Execution**: Execute code using the Judge0 API and see real-time results
- **Auto-save**: Files are automatically saved using localStorage
- **Syntax Highlighting**: Powered by CodeMirror editor
- **Tabbed Interface**: Switch between files easily with tabs
- **Console Panel**: View output, errors, and execution time
- **Resizable Panels**: Adjust the editor and console panel sizes
- **Keyboard Shortcuts**: Ctrl+S to save, Ctrl+Enter to run code
- **Code Templates**: Start with empty files or basic templates
- **File Download**: Download your files to your local machine
- **Find and Replace**: Search and replace text within your code
- **Code Folding**: Collapse and expand sections of your code
- **Code Formatting**: Format your code with a single click
- **Input Support**: Provide input (stdin) for your programs

## Setup Instructions

1. Clone or download this repository
2. Copy the `.env.example` file to `.env`
3. Get a RapidAPI key by signing up at [RapidAPI](https://rapidapi.com) and subscribing to the [Judge0 API](https://rapidapi.com/judge0-official/api/judge0-ce)
4. Replace the API key in your `.env` file:
   ```
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```
5. For local development, you can open `index.html` directly in your browser
6. For deployment, see the deployment section below

## Environment Variables

This project uses environment variables for API keys and configuration:

- `RAPIDAPI_KEY`: Your Judge0 API key from RapidAPI

For security, the actual `.env` file is not included in the repository. You should:
1. Copy `.env.example` to `.env`
2. Add your own API keys and configuration

## Keyboard Shortcuts

- `Ctrl + S`: Save all files
- `Ctrl + Enter`: Run the current file
- `Ctrl + F`: Find text
- `Ctrl + H`: Replace text
- `Ctrl + G`: Find next
- `Shift + Ctrl + G`: Find previous
- `Tab`: Insert 4 spaces (instead of tab character)
- `Ctrl + /`: Toggle comment on selected line(s)

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [CodeMirror](https://codemirror.net/) - Text editor component
- [Font Awesome](https://fontawesome.com/) - Icons
- [Judge0 API](https://rapidapi.com/judge0-official/api/judge0-ce) - Code execution
- [js-beautify](https://github.com/beautify-web/js-beautify) - Code formatting

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari

## Deployment

The application is static HTML/CSS/JavaScript and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static web hosting service

For API key security in production, consider:
- Using environment variables with your hosting platform
- Creating a proxy server to hide your API key from client-side code

## License

This project is released under the MIT License.

## Future Enhancements

- File sharing via links
- Version history
- Collaborative editing
- Mobile-responsive interface improvements
- Offline code execution option

---

Created by [Your Name] as a coding challenge project. 