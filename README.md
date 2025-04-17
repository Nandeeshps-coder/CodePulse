# CodePulse - Online Code Editor

A fully functional online code editor with support for multiple programming languages, built using HTML, CSS, and JavaScript.

![CodePulse Screenshot](https://via.placeholder.com/800x450.png?text=CodePulse+Online+Code+Editor)

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

## Setup Instructions

1. Clone or download this repository
2. Get a RapidAPI key by signing up at [RapidAPI](https://rapidapi.com) and subscribing to the [Judge0 API](https://rapidapi.com/judge0-official/api/judge0-ce)
3. Replace the API key in `js/api.js` with your own key:
   ```javascript
   this.headers = {
       'content-type': 'application/json',
       'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your key
       'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
   };
   ```
4. Open `index.html` in your browser

## Keyboard Shortcuts

- `Ctrl + S`: Save all files
- `Ctrl + Enter`: Run the current file
- `Tab`: Insert 4 spaces (instead of tab character)
- `Ctrl + /`: Toggle comment on selected line(s)

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [CodeMirror](https://codemirror.net/) - Text editor component
- [Font Awesome](https://fontawesome.com/) - Icons
- [Judge0 API](https://rapidapi.com/judge0-official/api/judge0-ce) - Code execution

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari

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