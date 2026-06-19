# Campus Planner

Campus Planner is a simple one-page web app for organizing student tasks, study plans, and campus activities. It was built with HTML, CSS, and JavaScript.

## GitHub Pages link

You can find the live GithHub pages link here : https://chuloezi.github.io/Campus_planner/ 

## DEMO video Link

https://www.loom.com/share/ceffa4f9853846a688c0b256511f2320

## Project Overview

This app helps a student keep track of important campus tasks. A user can add a task, set a due date, choose a category, enter an estimated duration, mark tasks as complete, edit tasks, delete tasks, search tasks, sort tasks, and save their data in the browser.

## Setup Guide

Open the project folder in a terminal and run:

python -m http.server 5500

Then open:

http://localhost:5500

## Features List

### Task Management

- Add new tasks.
- Edit existing tasks.
- Delete tasks.
- Mark tasks as complete or pending.
- Display task information clearly in cards.

### Dashboard

- Shows total tasks.
- Shows pending tasks.
- Shows completed tasks.
- Shows overdue tasks.

### Search and Sort

- Search tasks by title, category, or notes.
- Supports regex search.
- Handles invalid regex without crashing the app.
- Sort tasks by title, due date, or duration.

### Storage

- Saves tasks using `localStorage`.
- Keeps tasks after the page is refreshed.
- Saves user settings where needed.

### JSON Import and Export

- Export tasks as a JSON file.
- Import tasks from a JSON file.
- Includes a `seed.json` file with sample records for testing.

## Regex Catalog

This project uses regular expressions for validation and search.

### Title Validation

It makes sure the task title is not empty and contains normal readable text.

Example pattern:

/^[A-Za-z0-9 ]{3,60}$/

What it checks:

- Allows letters.
- Allows numbers.
- Allows spaces.
- Requires a reasonable length.

Example valid titles:

Math homework
Read chapter 4
Group meeting

Example invalid titles:

!!
A

### Date Validation

It makes sure the due date uses the correct date format.

Example pattern:

/^\d{4}-\d{2}-\d{2}$/

What it checks:

- Four digits for year.
- Two digits for month.
- Two digits for day.
- Uses the format "YYYY-MM-DD".

Example valid date:

2026-06-20

Example invalid date:

20/06/2026

### Duration Validation

It makes sure the estimated task duration is a number.

Example pattern:

/^\d+$/

What it checks:

- Allows digits only.
- Prevents letters and symbols.

Example valid duration:

45

Example invalid duration:

forty

### Tag or Category Validation

It makes sure a category or tag uses simple, readable words.

Example pattern:

/^[A-Za-z ]{2,30}$/

What it checks:

- Allows letters.
- Allows spaces.
- Keeps the category short and readable.

Example valid categories:

Study
Personal
Campus Event

Example invalid categories:

@@@
1

### Duplicate Word Check

It also catches repeated words in a task title or note.

Example pattern:

/\b(\w+)\s+\1\b/i

What it checks:

- Finds the same word repeated twice.
- The "i" flag makes it case-insensitive.

Example invalid text:

meeting meeting

### Regex Search

It allows the user to search tasks with normal text or regex patterns.

Example searches:

exam
study|meeting
^read

Error handling is included so that an invalid regex does not break the page.

## Keyboard Map

- `Tab`: move through links, inputs, and buttons
- `ArrowLeft` / `ArrowRight`: move between navigation links when a nav link is focused
- `Escape`: cancel editing a task
- `Enter`: submit forms or activate buttons

## Accessibility Notes

This project includes accessibility improvements so it can be used more easily by different users.

### Semantic HTML

The page uses meaningful HTML elements such as:

header
nav
main
section
article
footer
form
label
button

These help screen readers and browsers understand the page structure.

### Labels

Form inputs use labels so users know what each input is for.

### Keyboard Support

The main actions can be reached with the keyboard. Users can move through the page using "Tab", activate buttons with "Enter", and move through navigation links with arrow keys.

### Focus Styles

Interactive elements have visible focus styles so keyboard users can see where they are on the page.

### Error Messages

Validation errors are shown clearly when the user enters incorrect information.

### ARIA Live Messages

Status messages are announced when tasks are added, updated, deleted, imported, or exported.

### Color Contrast

The design uses dark blue text on light backgrounds to keep the page readable.

## Testing Instructions

### Manual Testing Checklist

Use this checklist before submission:

- Add a new task.
- Try submitting an empty form and check for an error.
- Add a task with a valid title, date, category, and duration.
- Mark a task as complete.
- Edit a task.
- Delete a task.
- Refresh the page and check that saved tasks remain.
- Search for a task using normal text.
- Search using a regex pattern.
- Enter an invalid regex and check that the app does not crash.
- Sort tasks by title.
- Sort tasks by due date.
- Sort tasks by duration.
- Export tasks as JSON.
- Import tasks from `seed.json`.
- Test the page on a small screen.
- Use the keyboard to move through the app.



