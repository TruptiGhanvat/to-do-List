const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

document.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = { text: taskText, completed: false };
    saveTask(task);
    displayTask(task);

    taskInput.value = "";
}

function displayTask(task) {
    const li = document.createElement("li");
    li.textContent = task.text;

    if (task.completed) li.classList.add("completed");

    li.addEventListener("click", () => {
        task.completed = !task.completed;
        li.classList.toggle("completed");
        updateTasksInLocalStorage();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", e => {
        e.stopPropagation();
        li.style.transform = "scale(0)";
        setTimeout(() => li.remove(), 200);
        removeTaskFromLocalStorage(task.text);
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveTask(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function removeTaskFromLocalStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTasksInLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.childNodes[0].textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    getTasksFromLocalStorage().forEach(displayTask);
}
