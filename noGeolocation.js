function getFormData() {
    var task = document.getElementById("task").value;
    if (checkInputText(task, "Please enter a task")) return;

    var who = document.getElementById("who").value;
    if (checkInputText(who, "Please enter a person to do the task")) return;

    var date = document.getElementById("dueDate").value;
    if (checkInputText(date, "Please enter a due date")) return;
    // later, process date here

    var id = (new Date()).getTime();
    var todoItem = new Todo(id, task, who, date);
    todos.push(todoItem);
    addTodoToPage(todoItem);
    saveTodoItem(todoItem);

    // hide search results
    hideSearchResults();
}

function createNewTodo(todoItem) {
    var li = document.createElement("li");
    li.setAttribute("id", todoItem.id);

    var spanTodo = document.createElement("span");
    spanTodo.innerHTML =
        todoItem.who + " needs to " + todoItem.task + " by " + todoItem.dueDate;

    var spanDone = document.createElement("span");
    if (!todoItem.done) {
        spanDone.setAttribute("class", "notDone");
        spanDone.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    else {
        spanDone.setAttribute("class", "done");
        spanDone.innerHTML = "&nbsp;&#10004;&nbsp;";
    }

    // create the amount of time until due feature
    var spanTimeUntilDue = document.createElement("span");
    try {
        var todoDueDate = Date.parse(todoItem.dueDate);
        if(isNaN(todoDueDate)) {
            throw new Error("There was a problem parsing the due date");
        }
        
        var today = new Date();
        var timeUntilDue = todoDueDate - today;
        var seconds = timeUntilDue / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = Math.abs(Math.floor(hours / 24));
                
        if (timeUntilDue < 0) {
            spanTimeUntilDue.innerHTML = " (OVERDUE by " + days + " days)";
        } else {
            spanTimeUntilDue.innerHTML = " (" + days + " days)";
        }

    } catch (ex) {
        // in the event there is a problem with parsing the date (which there won't be given the format 
        //  of this application), let the user know.
        console.log(ex.message);
        alert(ex.message);
    }

    // add the click handler to update the done state
    spanDone.onclick = updateDone;

    // add the delete link
    var spanDelete = document.createElement("span");
    spanDelete.setAttribute("class", "delete");
    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";

    // add the click handler to delete
    spanDelete.onclick = deleteItem;

    li.appendChild(spanDone);
    li.appendChild(spanTodo);
    li.appendChild(spanTimeUntilDue);
    li.appendChild(spanDelete);

    return li;
}