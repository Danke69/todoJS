// 簡易ユーザー
const USERS = [
  { username: "testuser", password: "1234" },
];

// ログイン処理
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const valid = USERS.find(u => u.username === user && u.password === pass);

  if (valid) {
    localStorage.setItem("loggedInUser", user);
    showTodoApp();
  } else {
    document.getElementById("loginError").textContent = "ユーザー名またはパスワードが違います";
  }
}

// ログイン済みなら表示
function showTodoApp() {
  document.getElementById("loginContainer").classList.add("hidden");
  document.getElementById("todoContainer").classList.remove("hidden");
}

// ログアウト
function logout() {
  localStorage.removeItem("loggedInUser");
  document.getElementById("todoContainer").classList.add("hidden");
  document.getElementById("loginContainer").classList.remove("hidden");
}

// ページ読み込み時
window.onload = () => {
  if (localStorage.getItem("loggedInUser")) showTodoApp();
  loadTasks();
};

// ---------------- ToDo機能 ----------------
function addTask(taskText = null, taskDate = null, taskCategory = null, completed = false, save = true) {
  const input = document.getElementById("taskInput");
  const dateInput = document.getElementById("taskDate");
  const categorySelect = document.getElementById("taskCategory");

  const text = taskText || input.value.trim();
  const date = taskDate || dateInput.value;
  const category = taskCategory || categorySelect.value;

  if (!text) return;

  const li = document.createElement("li");
  li.className = "bg-white p-2 rounded shadow flex justify-between items-center flex-wrap";

  const spanText = document.createElement("span");
  spanText.textContent = text;
  li.appendChild(spanText);

  if (date) {
    const spanDate = document.createElement("span");
    spanDate.textContent = `期限: ${date}`;
    li.appendChild(spanDate);
  }

  if (category) {
    const spanCategory = document.createElement("span");
    spanCategory.textContent = `[${category}]`;
    spanCategory.className = category === "仕事" ? "work text-blue-500" : category === "プライベート" ? "private text-green-500" : "other text-orange-500";
    li.appendChild(spanCategory);
  }

  if (completed) li.classList.add("line-through text-gray-400");

  // 完了ボタン
  const doneBtn = document.createElement("button");
  doneBtn.textContent = "完了";
  doneBtn.className = "bg-gray-300 px-2 rounded hover:bg-gray-400";
  doneBtn.onclick = () => {
    li.classList.toggle("line-through");
    li.classList.toggle("text-gray-400");
    saveTasks();
  };

  // 削除ボタン
  const delBtn = document.createElement("button");
  delBtn.textContent = "削除";
  delBtn.className = "bg-red-400 text-white px-2 rounded hover:bg-red-500";
  delBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  const btnContainer = document.createElement("div");
  btnContainer.className = "flex gap-2";
  btnContainer.appendChild(doneBtn);
  btnContainer.appendChild(delBtn);

  li.appendChild(btnContainer);

  document.getElementById("taskList").appendChild(li);

  if (!taskText) {
    input.value = "";
    dateInput.value = "";
  }

  if (save) saveTasks();
}

// 保存・復元
function saveTasks() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => {
    const spans = li.querySelectorAll("span");
    return {
      text: spans[0].textContent,
      date: spans[1] && spans[1].textContent.replace("期限: ", ""),
      category: spans[2] && spans[2].textContent.replace(/\[|\]/g, ""),
      completed: li.classList.contains("line-through")
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTask(task.text, task.date, task.category, task.completed, false));
}

// 検索
function filterTasks() {
  const filter = document.getElementById("searchInput").value.toLowerCase();
  const tasks = document.querySelectorAll("#taskList li");
  tasks.forEach(li => {
    const text = li.querySelector("span").textContent.toLowerCase();
    li.style.display = text.includes(filter) ? "" : "none";
  });
}
