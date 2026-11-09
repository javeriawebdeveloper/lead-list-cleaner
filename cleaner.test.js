'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { cleanList } = require('./cleaner.js');

test('README demo: output, counts, and original line numbers', () => {
  const result = cleanList('alex@example.com\nsam@example.com\nalex@example.com\nmissing-at.example.com\n  taylor@example.com\nSAM@example.com');
  assert.deepEqual(result.emails, ['alex@example.com', 'sam@example.com', 'taylor@example.com']);
  assert.equal(result.duplicates, 2);
  assert.equal(result.errors, 1);
  assert.deepEqual(result.issues.map(issue => [issue.line, issue.type]), [[3, 'Duplicate'], [4, 'Format error'], [6, 'Duplicate']]);
});

test('Windows lines, blanks, whitespace, first spelling, and plus aliases', () => {
  const result = cleanList('\r\n Alex@example.com \r\nalex@example.com\r\nalex+sales@example.com\r\n');
  assert.deepEqual(result.emails, ['Alex@example.com', 'alex+sales@example.com']);
  assert.equal(result.duplicates, 1);
  assert.equal(result.issues[0].line, 3);
});

test('basic format failures and unsupported markup are rejected', () => {
  const bad = ['alexexample.com', 'alex@@example.com', '@example.com', 'alex@', 'al ex@example.com', '.alex@example.com', 'alex.@example.com', 'al..ex@example.com', 'alex@-example.com', 'alex@example-.com', 'alex@example..com', 'alex@example', '"alex"@example.com', 'ál ex@example.com', '<script>@example.com'];
  const result = cleanList(bad.join('\n'));
  assert.deepEqual(result.emails, []);
  assert.equal(result.errors, bad.length);
  assert.equal(result.duplicates, 0);
});

test('empty lists and new independent runs have no stale state', () => {
  assert.deepEqual(cleanList(' \n\r\n'), { emails: [], issues: [], duplicates: 0, errors: 0 });
  cleanList('alex@example.com');
  assert.deepEqual(cleanList('sam@example.com').emails, ['sam@example.com']);
});

test('UI displays issues as text and clears results when input changes', () => {
  const vm = require('node:vm');
  const fs = require('node:fs');
  const elements = new Map();
  function element() {
    return {
      value: '', textContent: '', children: [], listeners: {},
      addEventListener(type, listener) { this.listeners[type] = listener; },
      replaceChildren() { this.children = []; },
      append(child) { this.children.push(child); }
    };
  }
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
    createElement() { return element(); }
  };
  vm.runInNewContext(fs.readFileSync('app.js', 'utf8'), { document, cleanList });
  const input = elements.get('email-input');
  input.value = 'alex@example.com\nalex@example.com\n<script>@example.com';
  elements.get('clean-button').listeners.click();
  assert.equal(elements.get('cleaned-output').value, 'alex@example.com');
  assert.match(elements.get('summary').textContent, /1 accepted unique addresses, 1 duplicate lines, 1 formatting errors/);
  assert.equal(elements.get('issues').children.length, 2);
  assert.match(elements.get('issues').children[1].textContent, /<script>@example.com/);
  input.value = '';
  input.listeners.input();
  assert.equal(elements.get('cleaned-output').value, '');
  assert.equal(elements.get('issues').children.length, 0);
});
