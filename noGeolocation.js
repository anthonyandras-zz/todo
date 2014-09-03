function populateTodoItem(todoItem) {
    todos.push(todoItem);
    addTodoToPage(todoItem);
    saveTodoItem(todoItem);
}
