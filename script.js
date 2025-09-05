const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filters button");

let todos = [];

function renderTodos(filter = "all") {
  todoList.innerHTML = "";

  const filteredTodos = todos.filter(todo => {
    if (filter === "completed") return todo.completed && !todo.removed;
    if (filter === "pending") return !todo.completed && !todo.removed;
    if (filter === "removed") return todo.removed;
    return true; // all
  });

  if (filteredTodos.length === 0) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "Nenhuma tarefa encontrada";
    todoList.appendChild(p);
    return;
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;

    // Container para o texto
    const textContainer = document.createElement("div");
    textContainer.className = "todo-text";
    const span = document.createElement("span");
    span.textContent = todo.text;
    textContainer.appendChild(span);

    // Container para os botões/sinalizações
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "todo-actions";

    if (!todo.removed) {
      if (!todo.completed) {
        const doneBtn = document.createElement("button");
        doneBtn.textContent = "Feito";
        doneBtn.className = "done";
        doneBtn.addEventListener("click", () => markDone(todo.id));
        actionsContainer.appendChild(doneBtn);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remover";
        removeBtn.className = "remove";
        removeBtn.addEventListener("click", () => removeTodo(todo.id));
        actionsContainer.appendChild(removeBtn);
      } else {
        const feitoBadge = document.createElement("span");
        feitoBadge.textContent = "FEITO";
        feitoBadge.className = "feito-badge";
        actionsContainer.appendChild(feitoBadge);
      }
    } else {
      const undoBtn = document.createElement("button");
      undoBtn.textContent = "Desfazer";
      undoBtn.className = "undo";
      undoBtn.addEventListener("click", () => undoRemove(todo.id));
      actionsContainer.appendChild(undoBtn);
    }

    li.appendChild(textContainer);
    li.appendChild(actionsContainer);
    todoList.appendChild(li);
  });
}

// Adiciona tarefa
function addTodo(text) {
  todos.push({ id: Date.now(), text, completed: false, removed: false });
  renderTodos();
}

// Marca como concluída
function markDone(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: true } : todo
  );
  renderTodos();
}

// Remove tarefa (marca como removida)
function removeTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, removed: true } : todo
  );
  renderTodos();
}

// Desfaz remoção
function undoRemove(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, removed: false, completed: false } : todo
  );
  renderTodos();
}

// Eventos do formulário
todoForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  addTodo(text);
  todoInput.value = "";
});

// Filtros
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active")); // Remove de todos
    button.classList.add("active"); // Adiciona ao selecionado
    renderTodos(button.dataset.filter);
  });
});

// Inicializa lista vazia
renderTodos();
filterButtons[0].classList.add("active"); // Marca o primeiro filtro como ativo

