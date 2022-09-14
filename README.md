# Canvas Line Editor
### By Robbie Neville
Canvas Line Editor my (ongoing) attempt at creating a plaintext editing interface for an IDE
I'm building with Electron.js.

## Why HTML Canvas?

Initially, when working on the interface for the aforementioned IDE, I used a single
`textarea` extending custom element for the text editing section. I knew this would be
an inefficient solution for large files (like `package-lock.json`), but I figured I could 
use it as a placeholder that I could build a framework of functionality around, and 
swap it out later for something better. 

The first alternative I thought of was using a `contenteditable` element for each line
of text in a file, but soon realised that this drastically impeded multi-line cursor
selections.

At the moment, I'm working on a similar solution that involves using a `canvas` extending
custom element for each line of text, and that's what you see here!

# Usage

Simply clone the repo, `cd` into the repo, and run `npm install`.

To fire it up, run `npm run dev` in the repo's root directory.