// functionality for people who are unlucky enough to have
// local storage enabled.

// get items from local storage and display them on the screen
function getTodoItems() {
    var request = new XMLHttpRequest();
    request.open("GET", "todo.json");
    request.onreadystatechange = function() {
      if (this.readyState == this.DONE && this.status == 200) {
        if (this.responseText) { 
          parseTodoItems(this.responseText);
          addTodosToPage();
        }
        else {
          console.log("Error: Data is empty");
        }
     }
    };
    request.send();
}


function parseTodoItems(todoJSON) {
    if (todoJSON == null || todoJSON.trim() == "") {
        return;
    }
    var todoArray = JSON.parse(todoJSON);
    if (todoArray.length == 0) {
        console.log("Error: the to-do list array is empty!");
        return;
    }
    for (var i = 0; i < todoArray.length; i++) {
        var todoItem = todoArray[i];
        todos.push(todoItem);
    }
}  

// save your todo item
function saveTodoItem(todoItem) {
  var todoJSON = JSON.stringify(todos);
  var request = new XMLHttpRequest();
  var URL = "save.php?data=" + encodeURI(todoJSON);
  console.log("saving " + encodeURI(todoJSON));
  request.open("GET", URL);
  request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  request.send();    
}

// delete your item
function deleteItem(e) {
    // TODO: implement me when you learn PHP or hook this up to a Rails back end.
}