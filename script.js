
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const categorySelect = document.getElementById('category');
    const tasksList = document.getElementById('tasks');
    const searchInput = document.getElementById('search-input');
    const clearTasksBtn = document.getElementById('clear-tasks');
    const backToTopBtn = document.getElementById('back-to-top');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = (filter = '') => {
      tasksList.innerHTML = '';
      tasks
        .filter(task => task.text.toLowerCase().includes(filter.toLowerCase()))
        .forEach((task, index) => {
          const li = document.createElement('li');
          if (task.completed) li.classList.add('completed');

          const span = document.createElement('span');
          span.textContent = `${task.text} [${task.category}]`;

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = task.completed;
          checkbox.addEventListener('change', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(searchInput.value);
          });

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks(searchInput.value);
          });

          li.append(checkbox, span, deleteBtn);
          tasksList.appendChild(li);
        });
    };

    taskForm.addEventListener('submit', e => {
      e.preventDefault();
      const text = taskInput.value.trim();
      const category = categorySelect.value;
      if (text) {
        tasks.push({ text, category, completed: false });
        taskInput.value = '';
        categorySelect.value = '';
        saveTasks();
        renderTasks(searchInput.value);
      }
    });

    clearTasksBtn.addEventListener('click', () => {
      if (confirm('Clear all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
      }
    });

    const debounce = (fn, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };

    searchInput.addEventListener('input', debounce((e) => {
      renderTasks(e.target.value);
    }, 300));

    const throttle = (fn, limit) => {
      let lastCall = 0;
      return function (...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
          lastCall = now;
          fn(...args);
        }
      };
    };

    window.addEventListener('scroll', throttle(() => {
      backToTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    }, 200));

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initial render
    renderTasks();
