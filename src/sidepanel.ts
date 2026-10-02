import { analyzeSchemas, parseJson, toMarkdown } from './analyzer.js';
const oldInput = document.querySelector<HTMLTextAreaElement>('#old')!; const nextInput = document.querySelector<HTMLTextAreaElement>('#next')!; const result = document.querySelector<HTMLElement>('#result')!; let markdown = '';
function run() { try { const report = analyzeSchemas(parseJson(oldInput.value), parseJson(nextInput.value)); markdown = toMarkdown(report); result.textContent = markdown; } catch (error) { result.textContent = `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`; } }
document.querySelector('#analyze')?.addEventListener('click', run); document.querySelector('#copy')?.addEventListener('click', () => { if (markdown) void navigator.clipboard.writeText(markdown); }); run();
