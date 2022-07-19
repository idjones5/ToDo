let inputtedTask;
let task;
let taskList;
let taskListLength;
let defaultTaskElements;
let checkboxes;
let taskArray = [];

// assigning inputted task to the value in the input box. Global assignment for usability
inputtedTask = document.querySelector("input");

// obtaining (ul) task-list
taskList = document.querySelector("ul");

// default tasks
defaultTaskElements = document.querySelectorAll(".delete-btn");

// number of elements in the task list
taskListLength = document.querySelector("ul").getElementsByTagName("li").length;

// obtaining the checkboxes of the ul
checkboxes = document.querySelectorAll("ul input");

/* Adds functionality to the add task button by allowing an inputted task to be added
* to the list of to-do items */
document.querySelector("#add-task-button").addEventListener("click", function() {
    task = inputtedTask.value; // getting the current input value

    let list = JSON.parse(localStorage.getItem("SavedTasked")) || [];

    // creating the new HTML elements for the new task
    let listnode = document.createElement("li");
    let input = document.createElement("input");
    let span = document.createElement("span");
    let button = document.createElement("button");
    let id = taskArray.length;

    listnode.setAttribute("id", `${taskListLength++}`); // assigning a unique id to task items
    input.setAttribute("type", "checkbox");
    span.setAttribute("class", "task");
    button.setAttribute("class", "delete-btn");

    span.innerText = `${task}`;
    button.innerHTML = "x";
    button.addEventListener("click", deleteTask);
    input.addEventListener("click", strike);

    listnode.append(input);
    listnode.append(span);
    listnode.append(button);

    taskList.append(listnode); // appending the final list node to the task list
    inputtedTask.value = ""; // resetting the input field

    if (!list.includes(id)) {
        taskArray.push({id: `${id++}`, task: `${task}`, isChecked: input.checked});
    } else {
        taskArray.push({id: `${id++}`, task: `${task}`, isChecked: list[id].isChecked.value});
    }
    // pushing each new object to the task array
    cacheItems();
})

/* Allows a specific task to be removed from the taskList */
let deleteTask = function() {
    let parentNode = this.parentNode;
    let id = parentNode.getAttribute("id"); // getting the index of the current list item

    parentNode.remove();
    taskArray.splice(id, 1); // editing the task array to delete the task from storage
    cacheItems(); // updating the stored file
}

/* Strikes through a completed task */
let strike = function() {
    let parentNode = this.parentNode;
    let span = parentNode.querySelector("span");
    let input = parentNode.querySelector("input");
    let id = parentNode.getAttribute("id");

    if (input.checked === true) {
        span.setAttribute("style", "text-decoration:line-through");
    } else {
        span.removeAttribute("style");
    }

    taskArray[id].isChecked = input.checked;
    cacheItems();
}

/* A function that cycles through the current items in the taskList and stores them in local storage */
let cacheItems = function() {
    let json = JSON.stringify(taskArray);
    localStorage.setItem("SavedTasked", json);
}

/* Adding event listeners to the default list elements */
for (let i=0; i < defaultTaskElements.length; i++) {
    defaultTaskElements[i].addEventListener("click", deleteTask);
}

/* Adding event listeners to the default checkboxes */
for (let i=0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("click", strike);
}

/* Upon load, this function checks to see if there are any previous tasks and if so, restores the previously created
* tasks */
window.addEventListener("load", function() {
    if (localStorage.getItem("SavedTasked")) {
        let list = JSON.parse(localStorage.getItem("SavedTasked")) || [];

        console.log(list)
        for (let i=0; i < list.length; i++) {
            inputtedTask.value = list[i].task;
            document.querySelector("#add-task-button").click();
            document.getElementById(`${i}`).querySelector("input").checked = list[i].isChecked;
        }
    }
})