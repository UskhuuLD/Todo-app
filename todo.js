const STORAGE_KEY = "todo-app-tasks";

const form = document.getElementById("taskForm");
const input = document.getElementById("task");
const list = document.getElementById("list");
const message = document.getElementById("message");
const stats = document.getElementById("stats");
const statsText = document.getElementById("statsText");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = load();
let filter = "all";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {

  }
}

function addTask(title) {
  const text = title.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), title: text, done: false });
  save();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  render();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
}

function visibleTasks() {
  if (filter === "active") return tasks.filter((t) => !t.done);
  if (filter === "completed") return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  list.innerHTML = "";

  const shown = visibleTasks();
  for (const task of shown) {
    const li = document.createElement("li");
    li.className = "item" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = task.title;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete";
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, span, del);
    list.appendChild(li);
  }

  if (tasks.length === 0) {
    message.hidden = false;
    message.querySelector("p").textContent = "No tasks yet. Add one above!";
  } else if (shown.length === 0) {
    message.hidden = false;
    message.querySelector("p").textContent = "No tasks in this view.";
  } else {
    message.hidden = true;
  }

  if (tasks.length === 0) {
    stats.hidden = true;
  } else {
    stats.hidden = false;
    const done = tasks.filter((t) => t.done).length;
    statsText.textContent = `${done} of ${tasks.length} tasks completed`;
    clearCompletedBtn.hidden = done === 0;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
    render();
  });
});

render();
