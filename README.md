# Lead List Cleaner

## The problem

Pasted email lists can contain repeated addresses, blank lines, and typing
mistakes. Lead List Cleaner will help users review a list and produce a clean
list of unique, correctly formatted email addresses in their browser.

## Current progress

All three development milestones are implemented on `develop`: format checks,
case-insensitive duplicate detection, line-by-line feedback, counts, and a copy
button. Editing the input clears old results. Input is processed locally without
storage or network requests. Final Windows browser review is still pending.

To review it on Windows, download the `develop` branch using GitHub's
**Code > Download ZIP**, extract the ZIP, and open `index.html` in Edge or Chrome.
Keep `styles.css` in the same folder as `index.html`.
Keep `cleaner.js` and `app.js` there too, and enable JavaScript in your browser.

Paste one address per line, choose **Clean list**, review the results, then choose
**Copy cleaned list**. The copy button is enabled only when there are accepted
addresses. If clipboard access is unavailable or blocked, the app selects the
output and asks you to press **Ctrl+C** on Windows. You can then paste the result
into a text editor to check it. Editing the input clears the output and disables
copying until you clean the list again.

Run the logic tests with Node.js: `node --test cleaner.test.js`.

## Planned features

- Paste one email address per line.
- Remove surrounding spaces and ignore blank lines.
- Flag repeated addresses and show which input lines contain them.
- Flag basic formatting errors with a short explanation and line number.
- Show each unique, correctly formatted address once, in its original order.
- Show counts for accepted addresses, duplicates, and formatting errors.
- Copy the cleaned list, with one address per line.
- Process the list in the browser without uploading or storing its contents.

For this small app, duplicate comparison will ignore letter case. The cleaned
list will keep the spelling of the first correctly formatted occurrence.
Different addresses, such as `alex@example.com` and `alex+sales@example.com`,
will remain separate.

## Format checks and limits

**The app checks email format only.** It does not check whether an address or
domain exists, whether a mailbox can receive email, whether a message will be
delivered, or whether someone has permission to contact the address.

The initial rules will accept a simple ASCII email format: one `@`, a nonempty
local part, and a domain with at least two labels separated by dots. The local
part may contain letters, numbers, dots, underscores, plus signs, and hyphens,
but cannot start or end with a dot or contain consecutive dots. Domain labels
may contain letters, numbers, and internal hyphens. Spaces inside an address
are not allowed.

These basic rules do not cover every technically valid email address. For
example, quoted local parts and internationalized addresses are outside the
initial scope. An accepted address is only correctly formatted under these
rules, not a verified contact.

## Fictional demo

All demo addresses use the reserved `example.com` domain.

Input:

```text
alex@example.com
sam@example.com
alex@example.com
missing-at.example.com
  taylor@example.com
SAM@example.com
```

Expected cleaned list:

```text
alex@example.com
sam@example.com
taylor@example.com
```

Expected feedback: 3 accepted unique addresses, 2 duplicate lines (3 and 6),
and 1 formatting error (line 4, missing `@`).

## How we will test

We will use fictional `example.com` addresses for all demos and test fixtures.

### Automated checks

- Confirm the demo produces the exact cleaned list, counts, and line numbers.
- Check exact duplicates and case variations, including `SAM@example.com`.
- Check surrounding spaces, blank lines, and both Windows and Unix line endings.
- Check missing or repeated `@`, empty parts, internal spaces, consecutive dots,
  and domain labels that begin or end with a hyphen.
- Confirm `alex+sales@example.com` and `alex@example.com` stay separate.
- Confirm output order and the spelling of the first accepted occurrence.
- Confirm empty input and input containing only errors produce no addresses.
- Confirm pasted markup is displayed as text and never executed.

### Browser checks

- Paste the demo in current Microsoft Edge and Google Chrome on Windows.
- Verify the results, line numbers, counts, and copy-to-clipboard output.
- Use only the keyboard to enter text, run the cleaner, and copy the result.
- Check labels and feedback are readable on narrow and wide screens.
- Clear the input and run again to confirm old results disappear.
- Inspect the browser's Network and storage tools to confirm pasted data is
  not sent to a server or saved in browser storage.
- Confirm the interface says "format only" and makes no deliverability claims.

No test will send email or attempt to verify a mailbox.

## Git workflow

`main` holds reviewed project work. We will build the app on `develop`, review
each milestone, and merge into `main` when ready.
