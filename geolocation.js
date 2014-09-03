function populateTodoItem(todoItem) {
  navigator.geolocation.getCurrentPosition(function(position) {
	  var latitude = position.coords.latitude,
	      longitude = position.coords.longitude;
	  todoItem.latitude = latitude;
	  todoItem.longitude = longitude;

      todos.push(todoItem);
      addTodoToPage(todoItem);
      saveTodoItem(todoItem);
  });
}
