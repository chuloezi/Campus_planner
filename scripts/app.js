class Task {
  constructor(taskData) {
    this.id = taskData.id || String(Date.now() + Math.floor(Math.random() * 1000));
    this.title = taskData.title.trim();
    this.dueDate = taskData.dueDate;
    this.duration = Number(taskData.duration);
    this.tag = taskData.tag.trim();
    this.notes = (taskData.notes || "").trim();
    this.completed = Boolean(taskData.completed);
    this.createdAt = taskData.createdAt || new Date().toISOString();
  }

  isOverdue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate + "T00:00:00");
    return !this.completed && due < today;
  }
}

class CampusPlanner {
  constructor() {
    this.tasks = [];
    this.taskLimit = 12;
    this.searchRegex = null;
    this.sampleTasks = [
      { title: "Read JavaScript notes", dueDate: "2026-06-22", duration: 45, tag: "Study", notes: "Review DOM events." },
      { title: "Finish CSS practice", dueDate: "2026-06-24", duration: 60, tag: "Coding", notes: "Use Flexbox and Grid." },
      { title: "Prepare group slides", dueDate: "2026-06-25", duration: 90, tag: "Group", notes: "Add screenshots." },
      { title: "Campus club meeting", dueDate: "2026-06-26", duration: 30, tag: "Club", notes: "Check room number." },
      { title: "Revise HTML forms", dueDate: "2026-06-27", duration: 40, tag: "Study", notes: "Practice labels and inputs." },
      { title: "Submit planner project", dueDate: "2026-06-30", duration: 120, tag: "Project", notes: "Test before submitting." },
      { title: "Watch regex tutorial", dueDate: "2026-07-01", duration: 35, tag: "Coding", notes: "Try search examples." },
      { title: "Update README file", dueDate: "2026-07-02", duration: 30, tag: "Project", notes: "Add features and test notes." },
      { title: "Study for web quiz", dueDate: "2026-07-03", duration: 75, tag: "Exam", notes: "Focus on localStorage." },
      { title: "Clean task list", dueDate: "2026-07-04", duration: 20, tag: "Admin", notes: "Delete old tasks." },
      { title: "Deploy to GitHub Pages", dueDate: "2026-07-05", duration: 50, tag: "Project", notes: "Add live link." }
    ];
  }

  start() {
    this.findElements();
    this.loadFromStorage();
    this.addEvents();
    this.showTasks();
  }

  findElements() {
    this.menuButton = document.getElementById("menuButton");
    this.mainMenu = document.getElementById("mainMenu");
    this.messageBox = document.getElementById("messageBox");
    this.form = document.getElementById("taskForm");
    this.editId = document.getElementById("editId");
    this.formHeading = document.getElementById("formHeading");
    this.saveButton = document.getElementById("saveButton");
    this.cancelEditButton = document.getElementById("cancelEditButton");
    this.titleInput = document.getElementById("titleInput");
    this.dateInput = document.getElementById("dateInput");
    this.durationInput = document.getElementById("durationInput");
    this.tagInput = document.getElementById("tagInput");
    this.notesInput = document.getElementById("notesInput");
    this.searchInput = document.getElementById("searchInput");
    this.searchHelp = document.getElementById("searchHelp");
    this.caseCheck = document.getElementById("caseCheck");
    this.sortSelect = document.getElementById("sortSelect");
    this.taskList = document.getElementById("taskList");
    this.taskCount = document.getElementById("taskCount");
    this.totalTasks = document.getElementById("totalTasks");
    this.pendingTasks = document.getElementById("pendingTasks");
    this.completedTasks = document.getElementById("completedTasks");
    this.overdueTasks = document.getElementById("overdueTasks");
    this.limitNotice = document.getElementById("limitNotice");
    this.exportButton = document.getElementById("exportButton");
    this.importFile = document.getElementById("importFile");
    this.clearDoneButton = document.getElementById("clearDoneButton");
    this.settingsForm = document.getElementById("settingsForm");
    this.taskLimitInput = document.getElementById("taskLimitInput");
  }

  addEvents() {
    this.menuButton.addEventListener("click", () => this.toggleMenu());

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });

    document.addEventListener("keydown", (event) => this.handleKeyboard(event));
    this.form.addEventListener("submit", (event) => this.saveTask(event));
    this.cancelEditButton.addEventListener("click", () => this.cancelEdit());
    this.searchInput.addEventListener("input", () => this.showTasks());
    this.caseCheck.addEventListener("change", () => this.showTasks());
    this.sortSelect.addEventListener("change", () => this.showTasks());
    this.taskList.addEventListener("click", (event) => this.handleTaskButton(event));
    this.exportButton.addEventListener("click", () => this.exportTasks());
    this.importFile.addEventListener("change", (event) => this.importTasks(event));
    this.clearDoneButton.addEventListener("click", () => this.clearCompletedTasks());
    this.settingsForm.addEventListener("submit", (event) => this.saveSettings(event));
  }

  toggleMenu() {
    const isOpen = this.mainMenu.classList.toggle("open");
    this.menuButton.setAttribute("aria-expanded", String(isOpen));
  }

  closeMenu() {
    this.mainMenu.classList.remove("open");
    this.menuButton.setAttribute("aria-expanded", "false");
  }

  handleKeyboard(event) {
    if (event.key === "Escape" && this.editId.value) {
      this.cancelEdit();
    }

    const activeLink = document.activeElement;
    if (!activeLink.classList || !activeLink.classList.contains("nav-link")) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    event.preventDefault();
    const links = Array.from(document.querySelectorAll(".nav-link"));
    const currentIndex = links.indexOf(activeLink);
    const change = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + change + links.length) % links.length;
    links[nextIndex].focus();
  }

  loadFromStorage() {
    try {
      const savedTasks = localStorage.getItem("campusTasksSimple");
      const savedLimit = localStorage.getItem("campusTaskLimitSimple");

      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks).map((item) => new Task(item));
      } else {
        this.tasks = this.sampleTasks.map((item) => new Task(item));
      }

      if (savedLimit) {
        this.taskLimit = Number(savedLimit);
        this.taskLimitInput.value = this.taskLimit;
      }
    } catch (error) {
      this.tasks = this.sampleTasks.map((item) => new Task(item));
      this.say("Saved data could not be loaded, so sample tasks were used.");
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("campusTasksSimple", JSON.stringify(this.tasks));
      localStorage.setItem("campusTaskLimitSimple", String(this.taskLimit));
    } catch (error) {
      this.say("The browser could not save your changes.");
    }
  }

  saveTask(event) {
    event.preventDefault();
    const formData = this.getFormData();
    const errors = this.validateTask(formData);
    this.showErrors(errors);

    if (Object.keys(errors).length > 0) {
      this.say("Please fix the form errors.");
      return;
    }

    if (!this.editId.value && this.tasks.length >= this.taskLimit) {
      this.say("You reached your task limit. Change it in settings if needed.");
      return;
    }

    if (this.editId.value) {
      this.tasks = this.tasks.map((task) => {
        if (task.id === this.editId.value) {
          return new Task({ ...task, ...formData, id: task.id, completed: task.completed, createdAt: task.createdAt });
        }
        return task;
      });
      this.say("Task updated.");
    } else {
      this.tasks.push(new Task(formData));
      this.say("Task added.");
    }

    this.saveToStorage();
    this.form.reset();
    this.cancelEdit();
    this.showTasks();
    document.getElementById("tasks").scrollIntoView({ behavior: "smooth" });
  }

  getFormData() {
    return {
      title: this.titleInput.value,
      dueDate: this.dateInput.value,
      duration: this.durationInput.value,
      tag: this.tagInput.value,
      notes: this.notesInput.value
    };
  }

  validateTask(task) {
    const errors = {};
    const titlePattern = /^[a-zA-Z0-9 .,!?'-]{3,60}$/;
    const repeatedWordPattern = /\b(\w+)\s+\1\b/i;
    const tagPattern = /^[a-zA-Z]+(?:[- ]?[a-zA-Z]+){0,2}$/;
    const numberPattern = /^\d+$/;

    if (!titlePattern.test(task.title.trim())) {
      errors.title = "Use 3 to 60 normal characters.";
    } else if (repeatedWordPattern.test(task.title)) {
      errors.title = "Avoid repeated words like 'study study'.";
    }

    if (!this.isRealDate(task.dueDate)) {
      errors.date = "Choose a real date.";
    }

    if (!numberPattern.test(String(task.duration)) || Number(task.duration) < 15 || Number(task.duration) > 600) {
      errors.duration = "Use minutes from 15 to 600.";
    }

    if (!tagPattern.test(task.tag.trim())) {
      errors.tag = "Use a short tag with letters only.";
    }

    return errors;
  }

  isRealDate(dateText) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) return false;
    const date = new Date(dateText + "T00:00:00");
    return date instanceof Date && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateText;
  }

  showErrors(errors) {
    this.setError("title", errors.title);
    this.setError("date", errors.date);
    this.setError("duration", errors.duration);
    this.setError("tag", errors.tag);
  }

  setError(name, message) {
    const input = document.getElementById(name + "Input");
    const error = document.getElementById(name + "Error");
    input.classList.toggle("input-error", Boolean(message));
    error.textContent = message || "";
  }

  showTasks() {
    this.searchRegex = this.makeSearchRegex();
    let visibleTasks = this.tasks.slice();

    if (this.searchRegex) {
      visibleTasks = visibleTasks.filter((task) => this.taskMatchesSearch(task));
    }

    visibleTasks = this.sortTasks(visibleTasks);
    this.renderTasks(visibleTasks);
    this.updateStats();
  }

  makeSearchRegex() {
    const searchText = this.searchInput.value.trim();
    if (!searchText) {
      this.searchHelp.textContent = "Invalid regex will not break the page.";
      return null;
    }

    try {
      const flags = this.caseCheck.checked ? "" : "i";
      this.searchHelp.textContent = "Search is working.";
      return new RegExp(searchText, flags);
    } catch (error) {
      this.searchHelp.textContent = "Invalid regex. Showing all tasks.";
      return null;
    }
  }

  taskMatchesSearch(task) {
    const taskText = `${task.title} ${task.tag} ${task.notes}`;
    return this.searchRegex.test(taskText);
  }

  sortTasks(taskList) {
    const sortChoice = this.sortSelect.value;

    return taskList.sort((a, b) => {
      if (sortChoice === "dateAsc") return a.dueDate.localeCompare(b.dueDate);
      if (sortChoice === "dateDesc") return b.dueDate.localeCompare(a.dueDate);
      if (sortChoice === "titleAsc") return a.title.localeCompare(b.title);
      if (sortChoice === "durationAsc") return a.duration - b.duration;
      return 0;
    });
  }

  renderTasks(taskList) {
    this.taskList.innerHTML = "";
    this.taskCount.textContent = `${taskList.length} task(s) showing`;

    if (taskList.length === 0) {
      this.taskList.innerHTML = `<p>No matching tasks found.</p>`;
      return;
    }

    taskList.forEach((task) => {
      const card = document.createElement("article");
      card.className = "task-card";
      if (task.completed) card.classList.add("done");
      if (task.isOverdue()) card.classList.add("overdue");

      card.innerHTML = `
        <h3>${this.highlight(this.cleanText(task.title))}</h3>
        <p>${this.cleanText(task.notes) || "No extra notes."}</p>
        <div class="task-info">
          <span>Due: ${this.cleanText(task.dueDate)}</span>
          <span>${task.duration} min</span>
          <span class="tag">${this.cleanText(task.tag)}</span>
          <span>${task.completed ? "Completed" : task.isOverdue() ? "Overdue" : "Pending"}</span>
        </div>
        <div class="task-actions">
          <button type="button" data-action="complete" data-id="${task.id}">${task.completed ? "Undo" : "Done"}</button>
          <button type="button" data-action="edit" data-id="${task.id}">Edit</button>
          <button type="button" data-action="delete" data-id="${task.id}">Delete</button>
        </div>
      `;

      this.taskList.appendChild(card);
    });
  }

  cleanText(text) {
    return String(text).replace(/[&<>"]/g, (character) => {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character];
    });
  }

  highlight(text) {
    if (!this.searchRegex || !this.searchInput.value.trim()) return text;
    try {
      return text.replace(this.searchRegex, (match) => `<mark>${match}</mark>`);
    } catch (error) {
      return text;
    }
  }

  handleTaskButton(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const taskId = button.dataset.id;
    const action = button.dataset.action;

    if (action === "complete") this.toggleComplete(taskId);
    if (action === "edit") this.startEdit(taskId);
    if (action === "delete") this.deleteTask(taskId);
  }

  toggleComplete(taskId) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === taskId) task.completed = !task.completed;
      return task;
    });
    this.saveToStorage();
    this.showTasks();
  }

  startEdit(taskId) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) return;

    this.editId.value = task.id;
    this.titleInput.value = task.title;
    this.dateInput.value = task.dueDate;
    this.durationInput.value = task.duration;
    this.tagInput.value = task.tag;
    this.notesInput.value = task.notes;
    this.formHeading.textContent = "Edit Task";
    this.saveButton.textContent = "Update Task";
    document.getElementById("add-task").scrollIntoView({ behavior: "smooth" });
    this.titleInput.focus();
  }

  cancelEdit() {
    this.editId.value = "";
    this.formHeading.textContent = "Add a Task";
    this.saveButton.textContent = "Save Task";
    this.showErrors({});
  }

  deleteTask(taskId) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) return;

    const answer = confirm(`Delete "${task.title}"?`);
    if (!answer) return;

    this.tasks = this.tasks.filter((item) => item.id !== taskId);
    this.saveToStorage();
    this.showTasks();
    this.say("Task deleted.");
  }

  clearCompletedTasks() {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.saveToStorage();
    this.showTasks();
    this.say("Completed tasks cleared.");
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const overdue = this.tasks.filter((task) => task.isOverdue()).length;
    const pending = total - completed;

    this.totalTasks.textContent = total;
    this.pendingTasks.textContent = pending;
    this.completedTasks.textContent = completed;
    this.overdueTasks.textContent = overdue;

    if (total >= this.taskLimit) {
      this.limitNotice.textContent = `You have reached your task limit of ${this.taskLimit}.`;
      this.limitNotice.classList.remove("hidden");
    } else {
      this.limitNotice.classList.add("hidden");
    }
  }

  saveSettings(event) {
    event.preventDefault();
    const newLimit = Number(this.taskLimitInput.value);

    if (newLimit < 3 || newLimit > 30) {
      this.say("Task limit must be between 3 and 30.");
      return;
    }

    this.taskLimit = newLimit;
    this.saveToStorage();
    this.showTasks();
    this.say("Settings saved.");
  }

  exportTasks() {
    try {
      const data = JSON.stringify(this.tasks, null, 2);
      const file = new Blob([data], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "campus-planner-tasks.json";
      link.click();
      URL.revokeObjectURL(link.href);
      this.say("Tasks exported.");
    } catch (error) {
      this.say("Could not export tasks.");
    }
  }

  importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const importedData = JSON.parse(reader.result);
        if (!Array.isArray(importedData)) throw new Error("Not an array");

        const importedTasks = importedData.map((item) => new Task(item));
        importedTasks.forEach((task) => {
          const errors = this.validateTask(task);
          if (Object.keys(errors).length > 0) throw new Error("Bad task data");
        });

        this.tasks = importedTasks;
        this.saveToStorage();
        this.showTasks();
        this.say("Tasks imported.");
      } catch (error) {
        this.say("Import failed. Please choose a valid JSON file.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  say(message) {
    this.messageBox.textContent = message;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const app = new CampusPlanner();
  app.start();
  window.campusPlanner = app;
});
