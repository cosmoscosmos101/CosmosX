// This file is required by the index.html file and will
// be executed in the renderer process for that window.

function addVSCodeButton() {
    // Remove existing buttons if any
    const existingButtons = document.querySelectorAll('.open-in-vscode');
    existingButtons.forEach(button => button.remove());

    const codeBlocks = document.querySelectorAll('code.language-rust');
    codeBlocks.forEach(codeBlock => {
        const code = codeBlock.textContent;
        const button = document.createElement('button');
        button.textContent = 'Open in VS Code';
        button.classList.add('open-in-vscode');
        button.addEventListener('click', () => {
            window.myAPI.openInVSCode(code);
        });
        codeBlock.parentElement.insertAdjacentElement('afterend', button);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const tableOfContents = document.getElementById('table-of-contents').querySelector('ul');
    const content = document.getElementById('content');
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    loginButton.addEventListener('click', () => {
        console.log('Username:', usernameInput.value);
        console.log('Password:', passwordInput.value);
    });

    const courseFiles = await window.myAPI.getCourseFiles();

    tableOfContents.innerHTML = '';

    courseFiles.forEach(file => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = file.replace('.md', '').replace(/^\d+-/, '');
        a.dataset.file = file;
        li.appendChild(a);
        tableOfContents.appendChild(li);
    });

    tableOfContents.addEventListener('click', async (event) => {
        if (event.target.tagName === 'A') {
            const file = event.target.dataset.file;
            try {
                const markdown = await window.myAPI.loadFile(file);
                const html = window.myAPI.parseMarkdown(markdown);
                content.innerHTML = html;
                addVSCodeButton();
            } catch (error) {
                console.error(error);
                content.innerHTML = `<p>Error loading file: ${error.message}</p>`;
            }
        }
    });

    if (courseFiles.length > 0) {
        try {
            const markdown = await window.myAPI.loadFile(courseFiles[0]);
            const html = window.myAPI.parseMarkdown(markdown);
            content.innerHTML = html;
            addVSCodeButton();
        } catch (error) {
            console.error(error);
            content.innerHTML = `<p>Error loading file: ${error.message}</p>`;
        }
    }
});
