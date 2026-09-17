# SCET Placement

This repository contains a static HTML/JS template for the SCET Placement portal. 

## How to Host Locally (For Development and Preview)

Since this project consists of static files (HTML, CSS, JS), you don't need a complex backend to run it. You can host it locally using any simple HTTP server. 

Here are the easiest ways to host it locally on your machine:

### Method 1: Using Node.js (Recommended)
If you have Node.js installed, this is the quickest way:
1. Open your terminal or command prompt in this directory.
2. Run the following command:
   ```bash
   npx serve
   ```
3. Open your browser and go to `http://localhost:3000`

### Method 2: Using Python
If you have Python installed, you can use its built-in HTTP server:
1. Open your terminal or command prompt in this directory.
2. Run the following command:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and go to `http://localhost:8000`

### Method 3: Using VS Code (Live Server Extension)
If you are using Visual Studio Code as your editor:
1. Install the **Live Server** extension by Ritwick Dey.
2. Open this folder in VS Code.
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. Your default browser will automatically open and refresh whenever you make changes to the code.
