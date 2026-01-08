// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require('electron')
const fs = require('fs').promises
const path = require('path')
const { marked } = require('marked')
const { exec } = require('child_process')
const os = require('os')

contextBridge.exposeInMainWorld('myAPI', {
  getCourseFiles: async () => {
    const coursePath = path.join(__dirname, 'courses');
    return await fs.readdir(coursePath);
  },
  loadFile: async (filePath) => {
    const coursePath = path.resolve(__dirname, 'courses');
    const fullPath = path.resolve(coursePath, filePath);

    if (!fullPath.startsWith(coursePath)) {
      throw new Error('Access Denied');
    }

    try {
      await fs.access(fullPath);
      return await fs.readFile(fullPath, 'utf8');
    } catch (e) {
      throw new Error('File not found');
    }
  },
  parseMarkdown: (markdown) => {
    return marked(markdown);
  },
  openInVSCode: async (code) => {
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, 'temp.rs');
    await fs.writeFile(tempFile, code);
    exec(`code ${tempFile}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
})
