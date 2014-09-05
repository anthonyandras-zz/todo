// functionality for people who are lucky enough to have
// local storage enabled.

// get items from local storage and display them on the screen
function getTodoItems() {
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


// save your todo item
function saveTodoItem(todoItem) {
    var key = "todo" + todoItem.id;
    var item = JSON.stringify(todoItem);
    localStorage.setItem(key, item);
}

// delete your item
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