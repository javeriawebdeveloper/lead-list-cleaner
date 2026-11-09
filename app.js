'use strict';

const input = document.getElementById('email-input');
const output = document.getElementById('cleaned-output');
const summary = document.getElementById('summary');
const issues = document.getElementById('issues');
const copyButton = document.getElementById('copy-button');
const copyStatus = document.getElementById('copy-status');
let revision = 0;

function resetResults() {
  revision++;
  output.value = '';
  copyButton.disabled = true;
  copyStatus.textContent = '';
  issues.replaceChildren();
  summary.textContent = 'Ready to check your list.';
}

input.addEventListener('input', resetResults);
document.getElementById('clean-button').addEventListener('click', () => {
  revision++;
  copyStatus.textContent = '';
  const result = cleanList(input.value);
  output.value = result.emails.join('\n');
  copyButton.disabled = result.emails.length === 0;
  summary.textContent = `${result.emails.length} accepted unique addresses, ${result.duplicates} duplicate lines, ${result.errors} formatting errors. Format only; mailboxes are not verified.`;
  issues.replaceChildren();
  for (const issue of result.issues) {
    const item = document.createElement('li');
    item.textContent = `Line ${issue.line} — ${issue.type}: ${issue.email} — ${issue.message}`;
    issues.append(item);
  }
});

copyButton.addEventListener('click', async () => {
  const text = output.value;
  if (!text) return;
  const copiedRevision = revision;
  copyButton.disabled = true;
  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      throw new Error('Clipboard unavailable');
    }
    await navigator.clipboard.writeText(text);
    if (revision === copiedRevision) copyStatus.textContent = 'Cleaned list copied.';
  } catch {
    if (revision === copiedRevision) {
      output.focus();
      output.select();
      copyStatus.textContent = 'Automatic copying is unavailable. The cleaned list is selected: press Ctrl+C on Windows, or use your device’s Copy command.';
    }
  } finally {
    if (revision === copiedRevision) copyButton.disabled = false;
  }
});
