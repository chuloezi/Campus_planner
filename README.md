# CampusPlanner

CampusPlanner is a simple one-page web app for organizing school tasks. It was built with beginner-friendly HTML, CSS, and JavaScript.

## How to run

Use VS Code Live Server, or run this command in the project folder:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

Opening the file directly with `file://` may cause browser security issues, so Live Server is better.

## Main features

- Add, edit, delete, and complete tasks
- Search tasks with normal text or regex patterns
- Sort tasks by due date, title, or duration
- Save tasks with localStorage
- Import and export JSON
- Show task stats: total, pending, completed, and overdue
- Simple task limit setting
- One-page navigation using section links

## Class concepts used

This project uses the same class concepts we practiced:

- Semantic HTML: `header`, `nav`, `main`, `section`, `article`, `footer`
- Flexbox for navigation and button rows
- CSS Grid for the dashboard cards and forms
- Media queries for smaller screens
- Form validation with regex
- DOM events with JavaScript
- localStorage for saving browser data
- JSON import and export
- Basic OOP with `Task` and `CampusPlanner` classes
- Keyboard support with Tab, Escape, and arrow keys in the nav

## Regex examples

The project uses regex for:

- Task title validation
- Duplicate word checking, for example `study study`
- Date format checking
- Number checking for duration
- Tag validation
- Live task search

## Keyboard map

- `Tab`: move through links, inputs, and buttons
- `ArrowLeft` / `ArrowRight`: move between navigation links when a nav link is focused
- `Escape`: cancel editing a task
- `Enter`: submit forms or activate buttons

## Accessibility notes

- Every input has a label
- The page has a skip link
- Focus styles are visible
- Status messages use `aria-live`
- Buttons use real button elements
- Navigation links move to sections on the same page

## Testing checklist

Before submitting, test these:

1. Add a valid task
2. Try invalid form values
3. Edit a task
4. Mark a task as done
5. Delete a task
6. Search using a regex like `study|coding`
7. Try an invalid regex like `[`
8. Export JSON
9. Import `seed.json`
10. Refresh the page and check that tasks stay saved
11. Use the keyboard only
12. Resize the browser to check mobile layout
