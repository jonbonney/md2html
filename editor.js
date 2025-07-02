// Import the marked library for markdown conversion
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

// Configure marked options
marked.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // Enable GitHub Flavored Markdown
    headerIds: true, // Add IDs to headers
    mangle: false, // Disable header ID mangling
    sanitize: false, // Allow HTML in markdown
});

// DOM Elements
const markdownInput = document.getElementById('markdown-input');
const cssInput = document.getElementById('css-input');
const htmlOutput = document.getElementById('html-output');
const preview = document.getElementById('preview');
const customStyleSheet = document.createElement('style');
document.head.appendChild(customStyleSheet);

// Tab switching functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabGroup = button.parentElement;
            const container = tabGroup.parentElement;
            const tabName = button.getAttribute('data-tab');
            
            // Update active tab
            tabGroup.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update active content
            container.querySelectorAll('.editor').forEach(editor => {
                editor.classList.remove('active');
            });
            container.querySelector(`[data-content="${tabName}"]`).classList.add('active');
        });
    });
}

// Convert markdown to HTML and update preview
function updatePreview() {
    const markdown = markdownInput.value;
    const html = marked(markdown);
    preview.innerHTML = html;
    htmlOutput.value = html;
}

// Update custom CSS
function updateCustomCSS() {
    customStyleSheet.textContent = cssInput.value;
}

// File download functionality
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Copy to clipboard functionality
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text:', err);
        return false;
    }
}

// Setup button event listeners
function setupButtons() {
    // Download buttons
    document.getElementById('download-markdown').addEventListener('click', () => {
        downloadFile(markdownInput.value, 'document.md', 'text/markdown');
    });

    document.getElementById('download-html').addEventListener('click', () => {
        // Include both HTML and CSS in the download
        const cssText = cssInput.value;
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
${cssText}
    </style>
</head>
<body>
    <div class="markdown-content">
${htmlOutput.value}
    </div>
</body>
</html>`;
        downloadFile(htmlContent, 'document.html', 'text/html');
    });

    // Copy buttons
    document.getElementById('copy-markdown').addEventListener('click', async () => {
        const success = await copyToClipboard(markdownInput.value);
        if (success) {
            const button = document.getElementById('copy-markdown');
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }
    });

    document.getElementById('copy-html').addEventListener('click', async () => {
        const success = await copyToClipboard(htmlOutput.value);
        if (success) {
            const button = document.getElementById('copy-html');
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }
    });
}

// Add input event listeners
function setupEditorListeners() {
    // Markdown input
    markdownInput.addEventListener('input', () => {
        updatePreview();
        // Save to localStorage
        localStorage.setItem('markdown-content', markdownInput.value);
    });

    // CSS input
    cssInput.addEventListener('input', () => {
        updateCustomCSS();
        // Save to localStorage
        localStorage.setItem('css-content', cssInput.value);
    });
}

// Load saved content from localStorage
function loadSavedContent() {
    const savedMarkdown = localStorage.getItem('markdown-content');
    const savedCSS = localStorage.getItem('css-content');

    if (savedMarkdown) {
        markdownInput.value = savedMarkdown;
        updatePreview();
    }

    if (savedCSS) {
        cssInput.value = savedCSS;
        updateCustomCSS();
    }
}

// Add file upload handling
function setupFileUpload() {
    const fileInput = document.getElementById('upload-markdown');
    
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            markdownInput.value = content;
            updatePreview();
            // Save to localStorage
            localStorage.setItem('markdown-content', content);
            // Reset file input
            fileInput.value = '';
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            alert('Error reading file. Please try again.');
        };
        reader.readAsText(file);
    });
}

// Update the initEditor function to include file upload setup
function initEditor() {
    setupTabs();
    setupButtons();
    setupEditorListeners();
    setupFileUpload();
    loadSavedContent();
    
    // Initial preview update
    updatePreview();
    updateCustomCSS();
}

// Start the editor when the DOM is loaded
document.addEventListener('DOMContentLoaded', initEditor); 