// To do list application with Search (from the Strings lab)
// You can use this code as your starting point, or continue with
// your own code.
//
function Todo(id, task, who, dueDate) {
    this.id = id;
    this.task = task;
    this.who = who;
    this.dueDate = dueDate;
    this.done = false;
    this.latitude = null;
    this.longitude = null;
}

var todos = new Array();
window.onload = init;

function init() {
    var submitButton = document.getElementById("submit");
    submitButton.onclick = getFormData;

    // get the search term and call the click handler
    var searchButton = document.getElementById("searchButton");
    searchButton.onclick = searchTodos;

    getTodoItems();
}

function getTodoItems() {
    if (localStorage) {
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.substring(0, 4) == "todo") {
                var item = localStorage.getItem(key);
                var todoItem = JSON.parse(item);
                todos.push(todoItem);
            }
        }
        addTodosToPage();
    }
    else {
        console.log("Error: you don't have localStorage!");
    }
}

function addTodosToPage() {
    var ul = document.getElementById("todoList");
    var listFragment = document.createDocumentFragment();
    for (var i = 0; i < todos.length; i++) {
        var todoItem = todos[i];
        var li = createNewTodo(todoItem);
        listFragment.appendChild(li);
    }
    ul.appendChild(listFragment);
}

function addTodoToPage(todoItem) {
    var ul = document.getElementById("todoList");
    var li = createNewTodo(todoItem);
    ul.appendChild(li);
    document.forms[0].reset();
}


function createNewTodo(todoItem) {
    var li = document.createElement("li");
    li.setAttribute("id", todoItem.id);

    var spanGeolocation = document.createElement("span");
    if(todoItem.latitude && todoItem.longitude) { spanGeolocation.innerHTML = "(" + todoItem.latitude + ", " + todoItem.longitude + ") "; }

    var spanTodo = document.createElement("span");
    var dueDate = new Date(todoItem.dueDate);

    spanTodo.innerHTML =
        todoItem.who + " needs to " + todoItem.task + " by " + dueDate.toLocaleDateString();

    var spanDone = document.createElement("span");
    if (!todoItem.done) {
        spanDone.setAttribute("class", "notDone");
        spanDone.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    else {
        spanDone.setAttribute("class", "done");
        spanDone.innerHTML = "&nbsp;&#10004;&nbsp;";
    }

    // add the click handler to update the done state
    spanDone.onclick = updateDone;

    // create span for displaying days until due
    var spanDaysUntilDue = document.createElement("span");
		var daysUntilDue = computeDateDifferenceFromToday(new Date(todoItem.dueDate));
    spanDaysUntilDue.innerHTML = daysUntilDue < 0 ? " (OVERDUE by " + Math.abs(daysUntilDue) + " days)" : " (" + daysUntilDue + " days)";

    // add the delete link
    var spanDelete = document.createElement("span");
    spanDelete.setAttribute("class", "delete");
    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";

    // add the click handler to delete
    spanDelete.onclick = deleteItem;

    li.appendChild(spanDone);
    li.appendChild(spanGeolocation);
    li.appendChild(spanTodo);
    li.appendChild(spanDaysUntilDue);
    li.appendChild(spanDelete);

    return li;
}

// create a function for determining the number of days between
// two provided dates. I thought about making this a method on 
// the todo object, but I figure this would work just as well.
function computeDateDifferenceFromToday(date) {
	var today = new Date();
  var timeDifference = date.getTime() - today.getTime();
  var seconds = timeDifference / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  return Math.floor(days); 
}

function getFormData() {
    var task = document.getElementById("task").value;
    if (checkInputText(task, "Please enter a task")) return;

    var who = document.getElementById("who").value;
    if (checkInputText(who, "Please enter a person to do the task")) return;

    var date = document.getElementById("dueDate").value;
    if (checkInputText(date, "Please enter a due date")) return;
    
    var id = (new Date()).getTime();
    var taskDate = Date.parse(date);
    // later, process date here
    // try to parse into an actual date object to set us up for 
    // "Support for dates, showing how many days until a task is due, or how many days overdue a task is."
    try {
        // I guess we can raise an exception here....
        if (isNaN(taskDate)) { throw new Error("Please enter a valid due date"); }
        var todoItem = new Todo(id, task, who, new Date(taskDate));
        // populate geolocation of todo item
        populateTodoItem(todoItem);

        // hide search results
        hideSearchResults();        
    } catch (ex) {
        alert(ex.message);
        return;
    } 
}

function checkInputText(value, msg) {
    if (value == null || value == "") {
        alert(msg);
        return true;
    }
    return false;
}

function saveTodoItem(todoItem) {
    if (localStorage) {
        var key = "todo" + todoItem.id;
        var item = JSON.stringify(todoItem);
        localStorage.setItem(key, item);
    }
    else {
        console.log("Error: you don't have localStorage!");
    }
}

function updateDone(e) {
    var span = e.target;
    var id = span.parentElement.id;
    var item;
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
            item = todos[i];
            break;
        }
    }
    if (item.done == false) {
        item.done = true;
        span.setAttribute("class", "done");
        span.innerHTML = "&nbsp;&#10004;&nbsp;";
    }
    else if (item.done == true) {
        item.done = false;
        span.setAttribute("class", "notDone");
        span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    var itemJson = JSON.stringify(item);
    var key = "todo" + id;
    localStorage.setItem(key, itemJson);
}

function deleteItem(e) {
    var span = e.target;
    var id = span.parentElement.id;

    // find and remove the item in localStorage
    var key = "todo" + id;
    localStorage.removeItem(key);

    // find and remove the item in the array
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
            todos.splice(i, 1);
            break;
        }
    }

    // find and remove the item in the page
    var li = e.target.parentElement;
    var ul = document.getElementById("todoList");
    ul.removeChild(li);

    // hide search results
    hideSearchResults();
}

// Search
function searchTodos() {
    // new search, so clear previous results
    clearSearchResultsList();
    // get the text to search for
    var searchTerm = document.getElementById("searchTerm").value;
    var count = 0;
    // check all the todos in the list
    for (var i = 0; i < todos.length; i++) {
        var todoItem = todos[i];
        // make a regular expression to match the search term, regardless of case
        var re = new RegExp(searchTerm, "i");
        // try matching the expression with the task and the who from the to do item
        // in this case, we don't need the match results array; we just need to know
        // it exists for this to do item. If there is no match results, then the 
        // result of match is null, so the "if" test will fail.
        if (todoItem.task.match(re) || todoItem.who.match(re)) {
            // if we find a match, add the to do item to the search results
            addSearchResultToPage(todoItem);
            // keep a count of the number of items we match
            count++;
        }
    }
    // if we don't match any items, display "no results" in the search results list
    if (count == 0) {
        var ul = document.getElementById("searchResultsList");
        var li = document.createElement("li");
        li.innerHTML = "No results!";
        ul.appendChild(li);
    }
    // show the search results
    showSearchResults();
}

// add a search result to the search results list in the page
function addSearchResultToPage(todoItem) {
    var ul = document.getElementById("searchResultsList");
    var li = document.createElement("li");
    li.innerHTML =
        todoItem.who + " needs to " + todoItem.task + " by " + todoItem.dueDate;
    ul.appendChild(li);
}

// clear the previous search results by removing all the children of the "searchResultsList" ul element
function clearSearchResultsList() {
    var ul = document.getElementById("searchResultsList");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
}

// This is just a nifty trick to show/hide the search results, so we don't show anything
// unless the user's just searched. Extra credit! :-)
function hideSearchResults() {
    var div = document.getElementById("searchResults");
    div.style.display = "none";
    clearSearchResultsList();
}

function showSearchResults() {
    var div = document.getElementById("searchResults");
    div.style.display = "block";
    document.forms[0].reset();
}

// compute the difference between two dates and return the result in days
function getDayDifference(date1, date2) {
    console.log(date1, date2);
    var timeDifference = date1.getTime() - date2.getTime();
    // console.log(timeDifference);
    var seconds = timeDifference / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    return Math.floor(days);
}
