const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('1. Resetting index.html from template.html...');
const templatePath = path.join(__dirname, '..', 'template.html');
const indexPath = path.join(__dirname, '..', 'index.html');
fs.copyFileSync(templatePath, indexPath);

console.log('2. Running vite build...');
execSync('npx vite build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

console.log('3. Running prepare_distribution.cjs...');
require('./prepare_distribution.cjs');

// 4. Restore root index.html from template.html so that Vite dev server and Vite preview always run smoothly
fs.copyFileSync(templatePath, indexPath);
console.log('4. Restored clean source index.html for Vite dev server.');

console.log('Build & distribution completed successfully!');

