const TASKFORM = document.getElementById('add-task-form');
const IDFIELD = document.getElementById('id-field');
const NAMEFIELD = document.getElementById('name-field');
const ASSIGNEE = document.getElementById('assignee-select');
const STATUS = document.getElementById('checkbox');
const FILTERSDIV = document.querySelector('.filters-div');
const EDITFORM = document.getElementById('edit-task-form');
const TABLEBODY = document.getElementById('table-body');
const SEARCHFIELD = document.getElementById('search-field');
const FILTERFIELD = document.getElementById('filter-field');
const SORTBUTTON = document.getElementById('sort-button');
const EDITIDFIELD = document.getElementById('edit-id-field');
const EDITNAMEFIELD = document.getElementById('edit-name-field');
const EDITASSIGNEEFIELD = document.getElementById('edit-assignee-field');
const EDITSTATUS = document.getElementById('edit-checkbox');

TASKFORM.addEventListener('submit', submit);
TABLEBODY.addEventListener('click', deleteTask);
TABLEBODY.addEventListener('click', showEditForm);
SEARCHFIELD.addEventListener('keyup', filterTasks);
FILTERFIELD.addEventListener('change', filterTasks);
SORTBUTTON.addEventListener('click', filterTasks);
EDITFORM.addEventListener('submit', editTask);

class Task {
  constructor(id, name, assignee, creationDate, status) {
    this.id = id;
    this.name = name;
    this.assignee = assignee;
    this.creationDate = creationDate;
    this.status = status;
  }
}

class TaskList {
  constructor() {
    this.tasks = new Storage().getTasks();
  }

  createTask(id, name, assignee, creationDate, status) {
    if (status.checked === true) {
      status = 'Done';
    } else {
      status = 'Pending';
    }
    creationDate = creationDate.toLocaleString('en-US');

    const CREATEDTASK = new Task(id, name, assignee, creationDate, status);

    this.tasks.push(CREATEDTASK);
    UI.addTaskInTable(TABLEBODY, CREATEDTASK);

    return this.tasks;
  }
  deleteTask(tableRowToDelete) {
    const IDTODELETE = tableRowToDelete.children[0].innerText;
    const UPDATEDTASKS = [];

    for (let task of this.tasks) {
      if (IDTODELETE !== task.id) {
        UPDATEDTASKS.push(task);
      }
    }

    this.tasks = UPDATEDTASKS;
    UI.removeTaskInTable(tableRowToDelete);
    return this.tasks;
  }
  editTask(idToEdit, name, assignee, creationDate, status) {
    if (status.checked === true) {
      status = 'Done';
    } else {
      status = 'Pending';
    }

    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === idToEdit) {
        this.tasks[i] = {
          id: idToEdit,
          name: name,
          assignee: assignee,
          creationDate: creationDate.toLocaleString('en-US'),
          status: status,
        };
      }
    }

    return this.tasks;
  }
  sortTasks(order) {
    if (order === 'ASC') {
      this.tasks = this.tasks.sort(
        (a, b) =>
          new Date(b.creationDate).getTime() -
          new Date(a.creationDate).getTime()
      );
    } else if (order === 'DESC') {
      this.tasks = this.tasks.sort(
        (a, b) =>
          new Date(a.creationDate).getTime() -
          new Date(b.creationDate).getTime()
      );
    }

    return this.tasks;
  }
  searchTasks(name, taskArray) {
    const SEARCHEDTASKS = [];

    for (let task of taskArray) {
      if (task.name.toLowerCase().includes(name.toLowerCase())) {
        SEARCHEDTASKS.push(task);
      }
    }

    return SEARCHEDTASKS;
  }
  filterTasks(status, tasksArray) {
    const FILTEREDTASKS = [];

    if (status === 'None') {
      return tasksArray;
    } else {
      for (let task of tasksArray) {
        if (task.status === status) {
          FILTEREDTASKS.push(task);
        }
      }
    }

    return FILTEREDTASKS;
  }
}

class Storage {
  static saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  getTasks() {
    if (JSON.parse(localStorage.getItem('tasks')) === null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem('tasks'));
    }
  }
  static saveId(id) {
    localStorage.setItem('id', id);
  }
  getId() {
    return localStorage.getItem('id');
  }
}

class UI {
  static addTaskInTable(tableBody, taskToAdd) {
    tableBody.innerHTML += `
      <tr class="table-row">
        <th class="table-cell">${taskToAdd.id}</th>
        <td class="table-cell">${taskToAdd.name}</td>
        <td class="table-cell">${taskToAdd.assignee}</td>
        <td class="table-cell">${taskToAdd.status}</td>
        <td class="table-cell">${taskToAdd.creationDate}</td>
        <td class="table-cell"><a class="delete-link" href="#">x</a><a href="#"><i class="bi bi-pencil-fill edit-link"></i></a></td>
      </tr>
    `;
  }
  static addRowInTable(tableBody, rowToAdd) {
    tableBody.innerHTML += `
      <tr class="table-row">
        <th class="table-cell">${rowToAdd.children[0].textContent}</th>
          <td class="table-cell">${rowToAdd.children[1].textContent}</td>
          <td class="table-cell">${rowToAdd.children[2].textContent}</td>
          <td class="table-cell">${rowToAdd.children[3].textContent}</td>
          <td class="table-cell">${rowToAdd.children[4].textContent}</td>
          <td class="table-cell"><a class="delete-link" href="#">x</a><a href="#"><i class="bi bi-pencil-fill edit-link"></i></a></td>
      </tr>
    `;
  }
  static removeTaskInTable(TableRowToRemove) {
    TableRowToRemove.remove();
  }
  static showEditForm(div, form, id, name, assignee) {
    form.children[0].value = id;
    form.children[1].value = name;
    form.children[2].value = assignee;

    div.appendChild(form);
  }
  static HideEditForm(div, form) {
    div.removeChild(form);
  }
  static changeDateIcon(icon) {
    if (icon.className === 'bi bi-arrow-down-square') {
      icon.className = 'bi bi-arrow-up-square';
    } else if (icon.className === 'bi bi-arrow-up-square') {
      icon.className = 'bi bi-arrow-down-square';
    }
  }
}

const TASKS = new TaskList();

for (let task of TASKS.tasks) {
  UI.addTaskInTable(TABLEBODY, task);
}

if (TASKS.tasks.length === 0) {
  IDFIELD.value = 1;
} else {
  IDFIELD.value = new Storage().getId();
}

UI.HideEditForm(FILTERSDIV, EDITFORM);

function submit(e) {
  e.preventDefault();

  if (NAMEFIELD.value === '') {
    alert('You have to enter a name');
  } else if (NAMEFIELD.value.length >= 100) {
    alert('You should enter a name less than 100 characters');
  } else {
    const NEWTASKS = new TaskList().createTask(
      IDFIELD.value,
      NAMEFIELD.value,
      ASSIGNEE.value,
      new Date(),
      STATUS
    );
    Storage.saveTasks(NEWTASKS);

    const NEWID = parseInt(IDFIELD.value) + 1;
    Storage.saveId(NEWID);
    IDFIELD.value = NEWID;
  }
}

function deleteTask(e) {
  if (e.target.classList.contains('delete-link')) {
    e.preventDefault();

    const TRTODELETE = e.target.parentElement.parentElement;
    const UPDATEDTASKS = new TaskList().deleteTask(TRTODELETE);

    Storage.saveTasks(UPDATEDTASKS);
  }
}

function filterTasks(e) {
  e.preventDefault();

  const TABLEROWS = Array.from(TABLEBODY.children);
  let filteredTasks;

  UI.changeDateIcon(e.target);

  for (let row of TABLEROWS) {
    UI.removeTaskInTable(row);
  }

  if (SORTBUTTON.children[0].classList.contains('bi-arrow-up-square')) {
    filteredTasks = new TaskList().sortTasks('ASC');
  } else {
    filteredTasks = new TaskList().sortTasks('DESC');
  }

  if (SEARCHFIELD.value === '') {
    filteredTasks = new TaskList().filterTasks(
      FILTERFIELD.value,
      filteredTasks
    );
  } else {
    if (FILTERFIELD.value === 'None') {
      filteredTasks = new TaskList().searchTasks(
        SEARCHFIELD.value,
        filteredTasks
      );
    } else {
      filteredTasks = new TaskList().searchTasks(
        SEARCHFIELD.value,
        filteredTasks
      );
      filteredTasks = new TaskList().filterTasks(
        FILTERFIELD.value,
        filteredTasks
      );
    }
  }

  for (let task of filteredTasks) {
    UI.addTaskInTable(TABLEBODY, task);
  }
}

function showEditForm(e) {
  if (e.target.classList.contains('edit-link')) {
    e.preventDefault();

    const TRTOEDIT =
      e.target.parentElement.parentElement.parentElement.children;

    UI.showEditForm(
      FILTERSDIV,
      EDITFORM,
      TRTOEDIT[0].innerText,
      TRTOEDIT[1].innerText,
      TRTOEDIT[2].innerText
    );
  }
}

function editTask(e) {
  e.preventDefault();
  const TABLEROWS = Array.from(TABLEBODY.children);
  const UPDATEDTASKS = new TaskList().editTask(
    EDITIDFIELD.value,
    EDITNAMEFIELD.value,
    EDITASSIGNEEFIELD.value,
    new Date(),
    EDITSTATUS
  );

  Storage.saveTasks(UPDATEDTASKS);

  for (let row of TABLEROWS) {
    UI.removeTaskInTable(row);
  }

  for (let task of UPDATEDTASKS) {
    UI.addTaskInTable(TABLEBODY, task);
  }

  UI.HideEditForm(FILTERSDIV, EDITFORM);
}
