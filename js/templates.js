// Language templates for different programming languages
const codeTemplates = {
    // Python templates
    python: {
        empty: '',
        basic: `# Python basic template
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
`
    },
    
    // JavaScript templates
    javascript: {
        empty: '',
        basic: `// JavaScript basic template
function main() {
    console.log("Hello, World!");
}

main();
`
    },
    
    // Java templates
    java: {
        empty: '',
        basic: `// Java basic template
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`
    },
    
    // C templates
    c: {
        empty: '',
        basic: `// C basic template
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`
    },
    
    // C++ templates
    cpp: {
        empty: '',
        basic: `// C++ basic template
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`
    },
    
    // C# templates
    csharp: {
        empty: '',
        basic: `// C# basic template
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
`
    },
    
    // Ruby templates
    ruby: {
        empty: '',
        basic: `# Ruby basic template
def main
  puts "Hello, World!"
end

main
`
    },
    
    // Go templates
    go: {
        empty: '',
        basic: `// Go basic template
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
`
    },
    
    // PHP templates
    php: {
        empty: '',
        basic: `<?php
// PHP basic template
function main() {
    echo "Hello, World!";
}

main();
?>
`
    }
};

// Language file extensions and mode mapping
const languageConfig = {
    python: {
        extension: '.py',
        mode: 'python',
        mimeType: 'text/x-python'
    },
    javascript: {
        extension: '.js',
        mode: 'javascript',
        mimeType: 'text/javascript'
    },
    java: {
        extension: '.java',
        mode: 'text/x-java',
        mimeType: 'text/x-java'
    },
    c: {
        extension: '.c',
        mode: 'text/x-csrc',
        mimeType: 'text/x-csrc'
    },
    cpp: {
        extension: '.cpp',
        mode: 'text/x-c++src',
        mimeType: 'text/x-c++src'
    },
    csharp: {
        extension: '.cs',
        mode: 'text/x-csharp',
        mimeType: 'text/x-csharp'
    },
    ruby: {
        extension: '.rb',
        mode: 'ruby',
        mimeType: 'text/x-ruby'
    },
    go: {
        extension: '.go',
        mode: 'go',
        mimeType: 'text/x-go'
    },
    php: {
        extension: '.php',
        mode: 'php',
        mimeType: 'application/x-httpd-php'
    }
};

// Judge0 language id mapping for API submissions
const languageIdMap = {
    python: 71,     // Python (3.8.1)
    javascript: 63, // JavaScript (Node.js 12.14.0)
    java: 62,       // Java (OpenJDK 13.0.1)
    c: 50,          // C (GCC 9.2.0)
    cpp: 54,        // C++ (GCC 9.2.0)
    csharp: 51,     // C# (Mono 6.6.0.161)
    ruby: 72,       // Ruby (2.7.0)
    go: 60,         // Go (1.13.5)
    php: 68,        // PHP (7.4.1)
};

// File icons for different languages
const fileIcons = {
    python: 'fa-brands fa-python',
    javascript: 'fa-brands fa-js',
    java: 'fa-brands fa-java',
    c: 'fa-solid fa-copyright',
    cpp: 'fa-solid fa-copyright',
    csharp: 'fa-brands fa-microsoft',
    ruby: 'fa-solid fa-gem',
    go: 'fa-solid fa-g',
    php: 'fa-brands fa-php',
    default: 'fa-regular fa-file-code'
}; 