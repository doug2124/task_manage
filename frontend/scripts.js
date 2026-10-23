const taskList = document.getElementById("taskList");
    const counter = document.getElementById("counter");
    const progressBar = document.getElementById("progressBar");
    const message = document.getElementById("message");
    const generateBtn = document.getElementById("generateBtn");

    async function generateTasks() {
      const goal = document.getElementById("goalInput")
        .value.trim();

      if (!goal) {
        message.textContent = "まずは目標を入力してください。";
        return;
      }

      generateBtn.disabled = true;
      generateBtn.textContent = "生成中...";
      message.textContent = "";

      try {
        const response = await fetch(
          "http://localhost:3000/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ goal })
          }
        );

        if (!response.ok) {
          throw new Error("タスクを生成できませんでした。APIの応答が不正です。");
        }

        const tasks = await response.json();

        if (!Array.isArray(tasks)) {
          throw new Error("タスクを生成できませんでした。APIの応答が不正です。");
        }

        taskList.innerHTML = "";

        tasks.forEach(createTaskElement);
        updateProgress();

        if (tasks.length === 0) {
          showEmpty("AIがタスクを生成できませんでした。");
        }
      } catch (error) {
        message.textContent =
          error.message.includes("Failed to fetch")
            ? "APIに接続できませんでした."
            : error.message;
      } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = "✦ タスクを生成";
      }
    }

    function createTaskElement(taskText) {
      const li = document.createElement("li");

      const check = document.createElement("button");
      check.className = "task-check";
      check.textContent = "✓";
      check.setAttribute("aria-label", "タスク完了");
      check.setAttribute("aria-pressed", "false");
      check.onclick = () => toggleTask(check);

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = String(taskText);

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const edit = document.createElement("button");
      edit.textContent = "Editar";
      edit.onclick = () => editTask(edit);

      const remove = document.createElement("button");
      remove.className = "delete";
      remove.textContent = "削除";
      remove.setAttribute("aria-label", "削除");
      remove.onclick = () => deleteTask(remove);

      actions.append(edit, remove);
      li.append(check, span, actions);
      taskList.appendChild(li);

      updateProgress();
    }

    function toggleTask(btn) {
      const li = btn.closest("li");
      const span = li.querySelector(".task-text");
      const completed = span.classList.toggle("done");

      btn.classList.toggle("checked", completed);
      btn.setAttribute("aria-pressed", String(completed));

      updateProgress();
    }

    function deleteTask(btn) {
      btn.closest("li").remove();

      if (taskList.children.length === 0) {
        showEmpty("タスクなし");
      }

      updateProgress();
    }

    function editTask(btn) {
      const span = btn.closest("li").querySelector(".task-text");
      const text = prompt("タスク編集", span.textContent);

      if (text !== null && text.trim()) {
        span.textContent = text.trim();
      }
    }

    function addTask() {
      const input = document.getElementById("newTask");
      const text = input.value.trim();

      if (!text) return;

      if (taskList.querySelector(".empty")) {
        taskList.innerHTML = "";
      }

      createTaskElement(text);
      input.value = "";
      input.focus();
    }

    document.getElementById("addTaskForm")
      .addEventListener("submit", event => {
        event.preventDefault();
        addTask();
      });

    document.getElementById("goalInput")
      .addEventListener("keydown", event => {
        if (event.key === "Enter") {
          generateTasks();
        }
      });

    function updateProgress() {
      const items = [...taskList.querySelectorAll("li")]
        .filter(li => !li.classList.contains("empty"));

      const completed = items.filter(li =>
        li.querySelector(".task-text").classList.contains("done")
      ).length;

      counter.textContent =
        `${completed}/${items.length} 完了`;

      progressBar.style.width = items.length
        ? `${completed / items.length * 100}%`
        : "0%";
    }

    function showEmpty(text) {
      taskList.innerHTML = "";

      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = text;

      taskList.appendChild(li);
    }