document.addEventListener("DOMContentLoaded",  () => {
  const form = document.querySelector(".form");
  const input = document.querySelector(".taskInput");
  const list = document.querySelector(".list");
  const clearBtn = document.querySelector(".clear-btn");
  let noTask = true;

  form.addEventListener("submit",  (e) => {
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

    taskText.textContent = input.value;
    checkIcon.innerHTML = '<i class="fa-solid fa-square-check"></i>';
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
    iconsDiv.classList.add("icons");

    // Insertion of tasks
    taskItem.appendChild(taskText);
    iconsDiv.appendChild(checkIcon);
    iconsDiv.appendChild(deleteIcon);
    taskItem.appendChild(iconsDiv);
    list.appendChild(taskItem);

    // Clear input after adding
    input.value = "";

    // Delete task functionality
    deleteIcon.addEventListener("click",  () => {
      taskItem.remove();
      if (list.children.length === 1) {
        // Only "Your Tasks" heading remains
          noTask = true;
      }
    });

    // Toggle task completion
    checkIcon.addEventListener("click",  () =>{
      taskText.style.textDecoration =
        taskText.style.textDecoration === "line-through"
          ? "none"
          : "line-through";
    });
  });

  // Clear all tasks
  clearBtn.addEventListener("click",  () => {
    list.innerHTML = '<p class="t">Your Tasks</p>';
    noTask = true;
  });
});
