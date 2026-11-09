'use strict';

const input = document.getElementById('email-input');
const output = document.getElementById('cleaned-output');
const summary = document.getElementById('summary');
const issues = document.getElementById('issues');

function resetResults() {
  output.value = '';
  issues.replaceChildren();
  summary.textContent = 'Ready to check your list.';
}

input.addEventListener('input', resetResults);
document.getElementById('clean-button').addEventListener('click', () => {
  const result = cleanList(input.value);
  output.value = result.emails.join('\n');
  summary.textContent = `${result.emails.length} accepted unique addresses, ${result.duplicates} duplicate lines, ${result.errors} formatting errors. Format only; mailboxes are not verified.`;
  issues.replaceChildren();
  for (const issue of result.issues) {
    const item = document.createElement('li');
    item.textContent = `Line ${issue.line} — ${issue.type}: ${issue.email} — ${issue.message}`;
    issues.append(item);
  }
});
