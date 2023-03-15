window.addEventListener("load", () => {
  // Store our todo list in local storage so we do not lose it when we reload the page
  todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  // Retrieve the name input and store it in a variable called nameInput
  const nameInput = document.getElementById("firstname");
  //   Retrieve the form element and store it in a variable called todoForm
  const todoForm = document.querySelector("#create_todo");

  //   Get the user name inputted by the user and store in localStorage so we do not lose it on reload
  const userName = localStorage.getItem("userName") || "";

  //   Retrieve the stored user name from local Storage on reload
  nameInput.value = userName;

  //   Listen for any change in the user name and save the new input for retrieval on reload
  nameInput.addEventListener("change", (e) => {
    localStorage.setItem("userName", e.target.value);
  });

  todoForm.addEventListener("submit", (e) => {
    //   To prevent the browser from refreshing the page every time we submit the form
    e.preventDefault();

    const todo = {
      content: e.target.elements.content.value,
      category: e.target.elements.category.value,
      done: false,
      createdAt: new Date().getTime(),
    };

    // Preventing empty values from being added by using the alert method
    !todo.content
      ? alert("Field cannot be empty. Kindly fill in a task")
      : // update our todoList array with each new task defined by user
        todoList.push(todo);

    // Store our todoList into local storage
    localStorage.setItem("todoList", JSON.stringify(todoList));

    // reset fields to empty input and unchecked items when the add button is clicked
    e.target.reset();

    // Create a new function to display the user todo list items
    DisplayTodos();
  });

  //   Call the DisplayTodos function
  DisplayTodos();
});

function DisplayTodos() {
  // retrieve the div element containing the todo list items and storing it in a variable
  const todoListItem = document.getElementById("todo");

  todoListItem.innerHTML = "";

  //   Using the createdAt key prop created in the todo object above, sort the task list for the last task to come first
  todoList.sort((a, b) => b.createdAt - a.createdAt);
  todoList.forEach((todo) => {
    // create a div element for each list
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo_item");

    // creating all the child elements like we had in our dummy todo list
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const content = document.createElement("div");
    const actions = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    input.type = "checkbox";
    // check if the task has been done or not
    input.checked = todo.done;
    span.classList.add("stretch");

    // use the span element to check for personal or business
    todo.category == "personal"
      ? span.classList.add("personal")
      : span.classList.add("business");

    content.classList.add("todo_content");
    actions.classList.add("todo_actions");
    editButton.classList.add("edit-button");
    deleteButton.classList.add("delete-button");

    // creating an input tag using innerHTML and storing it into the content value in local storage
    content.innerHTML = `<input type="text" value="${todo.content}" readonly />`;
    editButton.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";

    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(actions);

    todoListItem.appendChild(todoItem);

    // Add the class of done to show that that task has been done applying the styling
    if (todo.done) {
      todoItem.classList.add("done");
    }

    input.addEventListener("click", (e) => {
      todo.done = e.target.checked;
      localStorage.setItem("todoList", JSON.stringify(todoList));

      todo.done
        ? todoItem.classList.add("done")
        : todoItem.classList.remove("done");

      DisplayTodos();
    });

    // Working on editing task inputted by the user
    editButton.addEventListener("click", (e) => {
      // retrieving the input element
      const input = content.querySelector("input");
      input.removeAttribute("readOnly");
      //   We could also use 'input.readOnly = false;'
      input.focus();
      //   Creating a blur effect when the user clicks outside the edit area
      input.addEventListener("blur", (e) => {
        input.setAttribute("readOnly", true);
        todo.content = e.target.value;
        // storing it persistently in local storage
        localStorage.setItem("todoList", JSON.stringify(todoList));
        DisplayTodos();
      });
    });

    // Working on deleting once the delete button is clicked
    deleteButton.addEventListener("click", (e) => {
      todoList = todoList.filter((todoitem) => todoitem != todo);
      localStorage.setItem("todoList", JSON.stringify(todoList));
      DisplayTodos();
    });
  });
}
