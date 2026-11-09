'use strict';

function formatError(email) {
  if (/\s/.test(email)) return 'Spaces inside an address are not allowed.';
  if ((email.match(/@/g) || []).length !== 1) return 'Use exactly one @.';
  const [local, domain] = email.split('@');
  if (!local || !domain) return 'Include both parts around @.';
  if (!/^[A-Za-z0-9._+-]+$/.test(local)) return 'The part before @ contains unsupported characters.';
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
    return 'The part before @ cannot start or end with a dot or contain consecutive dots.';
  }
  const labels = domain.split('.');
  if (labels.length < 2 || labels.some(label => !/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label))) {
    return 'Use a dotted domain with nonempty labels and no leading or trailing hyphens.';
  }
  return null;
}

function cleanList(input) {
  const emails = [];
  const issues = [];
  const seen = new Map();
  let duplicates = 0;
  let errors = 0;
  input.split(/\r\n|\n|\r/).forEach((text, index) => {
    const email = text.trim();
    if (!email) return;
    const line = index + 1;
    const error = formatError(email);
    if (error) {
      errors++;
      issues.push({ line, email, type: 'Format error', message: error });
      return;
    }
    const key = email.toLowerCase();
    if (seen.has(key)) {
      duplicates++;
      issues.push({ line, email, type: 'Duplicate', message: `Already included from line ${seen.get(key)}.` });
      return;
    }
    seen.set(key, line);
    emails.push(email);
  });
  return { emails, issues, duplicates, errors };
}

if (typeof module !== 'undefined') module.exports = { cleanList, formatError };
