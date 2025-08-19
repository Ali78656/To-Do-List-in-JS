document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const input = document.querySelector(".taskInput");
  const list = document.querySelector(".list");
  const clearBtn = document.querySelector(".clear-btn");
  const filterButtons = document.querySelectorAll(".filter-btn"); // Get filter buttons
  let noTask = true;

  // Function to save tasks to local storage
  function saveTasks() {
    const tasks = [];
    list.querySelectorAll("li").forEach((taskItem) => {
      const taskText = taskItem.querySelector("p").textContent;
      const isCompleted =
        taskItem.querySelector("p").style.textDecoration === "line-through";
      tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Function to load tasks from local storage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks && tasks.length > 0) {
      list.innerHTML = '<p class="t">Your Tasks</p>';
      noTask = false;
      tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        const taskText = document.createElement("p");
        const iconsDiv = document.createElement("div");
        const checkIcon = document.createElement("div");
        const deleteIcon = document.createElement("div");
        const editIcon = document.createElement("div"); // Add edit icon

        taskText.textContent = task.text;
        if (task.completed) {
          taskText.style.textDecoration = "line-through";
        }
        checkIcon.innerHTML = '<i class="fa-solid fa-square-check"></i>';
        deleteIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
        editIcon.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'; // Set edit icon HTML
        iconsDiv.classList.add("icons");

        taskItem.appendChild(taskText);
        iconsDiv.appendChild(checkIcon);
        iconsDiv.appendChild(deleteIcon);
        iconsDiv.appendChild(editIcon); // Append edit icon
        taskItem.appendChild(iconsDiv);
        list.appendChild(taskItem);

        // Re-attach event listeners
        deleteIcon.addEventListener("click", () => {
          taskItem.remove();
          if (
            list.children.length === 1 &&
            list.firstElementChild.classList.contains("t")
          ) {
            noTask = true;
            list.innerHTML = "";
          }
          saveTasks();
        });

        checkIcon.addEventListener("click", () => {
          taskText.style.textDecoration =
            taskText.style.textDecoration === "line-through"
              ? "none"
              : "line-through";
          saveTasks();
        });

        editIcon.addEventListener("click", () => {
          const currentText = taskText.textContent;
          const editInput = document.createElement("input");
          editInput.type = "text";
          editInput.value = currentText;
          editInput.classList.add("edit-input");

          taskItem.replaceChild(editInput, taskText);
          editInput.focus();

          const saveEdit = () => {
            const newText = editInput.value.trim();
            if (newText === "") {
              alert("Task cannot be empty!");
              taskItem.replaceChild(taskText, editInput);
              return;
            }
            taskText.textContent = newText;
            taskItem.replaceChild(taskText, editInput);
            saveTasks();
          };

          editInput.addEventListener("blur", saveEdit);
          editInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
              saveEdit();
            }
          });
        });
      });
    } else {
      list.innerHTML = "";
      noTask = true;
    }
    // Apply the current filter after loading tasks
    const currentFilter =
      document.querySelector(".filter-btn.active").dataset.filter;
    filterTasks(currentFilter);
  }

  // Load tasks when the page loads
  loadTasks();

  // Function to filter tasks
  function filterTasks(filterType) {
    const tasks = list.querySelectorAll("li");
    tasks.forEach((taskItem) => {
      // Skip the "Your Tasks" heading
      if (taskItem.classList.contains("t")) {
        return;
      }

      const taskText = taskItem.querySelector("p");
      const isCompleted = taskText.style.textDecoration === "line-through";

      switch (filterType) {
        case "all":
          taskItem.style.display = "flex";
          break;
        case "pending":
          if (isCompleted) {
            taskItem.style.display = "none";
          } else {
            taskItem.style.display = "flex";
          }
          break;
        case "completed":
          if (isCompleted) {
            taskItem.style.display = "flex";
          } else {
            taskItem.style.display = "none";
          }
          break;
      }
    });
  }

  // Event listeners for filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      filterTasks(e.target.dataset.filter);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Check if input is empty
    if (input.value.trim() === "") {
      alert("Please enter a task!");
      return; // Exit the function if input is empty
    }

    if (noTask) {
      list.innerHTML = '<p class="t">Your Tasks</p>';
      noTask = false;
    }

    // Create task item
    const taskItem = document.createElement("li");
    const taskText = document.createElement("p");
    const iconsDiv = document.createElement("div");
    const checkIcon = document.createElement("div");
    const deleteIcon = document.createElement("div");
    const editIcon = document.createElement("div"); // Add edit icon

    taskText.textContent = input.value;
    checkIcon.innerHTML = '<i class="fa-solid fa-square-check"></i>';
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
    editIcon.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'; // Set edit icon HTML
    iconsDiv.classList.add("icons");

    // Insertion of tasks
    taskItem.appendChild(taskText);
    iconsDiv.appendChild(checkIcon);
    iconsDiv.appendChild(deleteIcon);
    iconsDiv.appendChild(editIcon); // Append edit icon
    taskItem.appendChild(iconsDiv);
    list.appendChild(taskItem);

    // Save tasks after adding a new one
    saveTasks();
    filterTasks(document.querySelector(".filter-btn.active").dataset.filter); // Apply filter after adding task

    // Clear input after adding
    input.value = "";

    // Delete task functionality
    deleteIcon.addEventListener("click", () => {
      taskItem.remove();
      if (
        list.children.length === 1 &&
        list.firstElementChild.classList.contains("t")
      ) {
        // Only "Your Tasks" heading remains
        list.innerHTML = ""; // Clear the heading as well
        noTask = true;
      } else if (list.children.length === 0) {
        // If there are no children at all, it means no tasks and no heading.
        noTask = true;
      }
      saveTasks();
      filterTasks(document.querySelector(".filter-btn.active").dataset.filter); // Apply filter after deleting task
    });

    // Toggle task completion
    checkIcon.addEventListener("click", () => {
      taskText.style.textDecoration =
        taskText.style.textDecoration === "line-through"
          ? "none"
          : "line-through";
      saveTasks();
      filterTasks(document.querySelector(".filter-btn.active").dataset.filter); // Apply filter after toggling completion
    });

    // Edit task functionality
    editIcon.addEventListener("click", () => {
      const currentText = taskText.textContent;
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = currentText;
      editInput.classList.add("edit-input");

      taskItem.replaceChild(editInput, taskText);
      editInput.focus();

      const saveEdit = () => {
        const newText = editInput.value.trim();
        if (newText === "") {
          alert("Task cannot be empty!");
          taskItem.replaceChild(taskText, editInput); // Revert to original text if empty
          return;
        }
        taskText.textContent = newText;
        taskItem.replaceChild(taskText, editInput);
        saveTasks();
        filterTasks(
          document.querySelector(".filter-btn.active").dataset.filter
        ); // Apply filter after editing task
      };

      editInput.addEventListener("blur", saveEdit);
      editInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          saveEdit();
        }
      });
    });
  });

  // Clear all tasks
  clearBtn.addEventListener("click", () => {
    list.innerHTML = ""; // Clear everything
    noTask = true;
    saveTasks();
  });
});
