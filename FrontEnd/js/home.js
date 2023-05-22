// Variables respectivas a la API
const headers = {
    'Content-Type': 'application/json',
}
// Funciones para el consumo de la API
const PostData = async (name, description, status) => {
    const task = { name, description, status }
    const response = await fetch('http://localhost:8000/api/task/', {
        method: 'POST',
        headers,
        body: JSON.stringify(task),
    })
    if (!response.ok) throw new Error('Error al crear la tarea');
    const data = await response.json()
    return data
}

const GetDataFromAPI = async (taskId = "") => {
    const response = await fetch(`http://localhost:8000/api/task/${taskId}`)
    const data = await response.json()
    return data
}

const PutData = async (taskId, data) => {
    const response = await fetch(`http://localhost:8000/api/task/${taskId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar la tarea');
    const responseData = await response.json();
    return responseData;
};

const DeleteData = async (taskId) => {
    const response = await fetch(`http://localhost:8000/api/task/${taskId}`, { 
      method: 'DELETE' 
    })
    if (!response.ok) throw new Error('Error al eliminar la tarea');
    const data = await response.json()
    return data
}

// Eventos para el formulario de creación de tareas
const BtnAddTask = document.getElementById('btn-submit');
BtnAddTask.addEventListener('click', createTask);

// Funciones del Formulario para crear tareas
const GetDataFromForm = () => {  
    const name = document.getElementById('task-name').value
    const description = document.getElementById('task-desc').value
    const status = document.getElementById('task-status').value
    const data = { name, description, status }
    return data
}

const getCurrentDate = () => {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const currentDate = `${year}-${month < 10 ? "0"+month : month}-${day}`
    return currentDate
}

async function createTask() {
  const form = document.getElementById('task-form');
  const data = GetDataFromForm();
  const { name, description, status } = data;
  const newTask  = await PostData(name, description, status);
  form.reset();
  addTaskToList(newTask);
}

// Variables para la lista de tareas
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Eventos para la lista de tareas
document.addEventListener('DOMContentLoaded', UpdateList); // Nuevo evento

// Llenando la tabla con las tareas
function createTaskElement(task) {
  const { id, name, description, status, created_at } = task;

  const taskRow = document.createElement('tr');
  taskRow.classList.add('task-item');
  taskRow.dataset.id = id;

  const cells = ['name', 'description', 'status', 'created_at'].map((prop) => {
    const cell = document.createElement('td');
    cell.textContent = prop === 'created_at' ? created_at.split('T')[0] : task[prop];
    return cell;
  });

  const actionsCell = document.createElement('td');
  actionsCell.classList.add('actions');
  actionsCell.innerHTML = `
    <button class="delete-btn">Eliminar</button>
    <button class="edit-btn">Editar</button>
    <button class="complete-btn">Completar</button>
  `;

  const [deleteButton, editButton, completeButton] = actionsCell.querySelectorAll('button');

  deleteButton.addEventListener('click', () => DeleteTask(id));
  editButton.addEventListener('click', () => OpenEditWin(id));
  completeButton.addEventListener('click', () => CompleteTask(id));

  cells.forEach((cell) => taskRow.appendChild(cell));
  taskRow.appendChild(actionsCell);

  return taskRow;
}
  
// Función para limpiar la lista de tareas
function clearList() {
    taskList.innerHTML = '';
}

// Función para llenar la lista de tareas (Nuevo)
async function UpdateList() {
  clearList();
  const tasks = await GetDataFromAPI();  
  tasks.forEach(task => {
    task.created_at = task.created_at.split('T')[0];
    taskList.appendChild(createTaskElement(task));
  });
}

// Función para agregar una tarea a la lista sin volverla a llenar
async function addTaskToList(task) {
  task.created_at = task.created_at.split('T')[0];
  taskList.appendChild(createTaskElement(task));
}

// Editar tarea
// Funciones y eventos de los botones de la fila de la tarea

// Eventos para el modal de edición de tareas
window.addEventListener('click', function(event) {
  const modal = document.getElementById('edit-modal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Funciones para el modal de edición de tareas
async function OpenEditWin(taskId) {
  // Obteniendo los elementos del modal
  const modal = document.getElementById('edit-modal');
  const closeButton = document.querySelector('.close');
  const editFormButton = document.getElementById('btn-update');
  const editForm = document.getElementById('edit-form');

  // Obteniendo los datos de la tarea a editar
  const task = document.querySelector(`[data-id="${taskId}"]`);
  const taskName = task.querySelector('td:nth-child(1)').textContent;
  const taskDesc = task.querySelector('td:nth-child(2)').textContent;

  // Actualizando los input del modal con los datos de la tarea
  modal.querySelector('#edit-task-name').value = taskName;
  modal.querySelector('#edit-task-desc').value = taskDesc;

  // Mostrando el modal
  modal.style.display = 'block';

  // Evento para cerrar el modal
  closeButton.addEventListener('click', () => { modal.style.display = 'none' });

  // Evento para actualizar la tarea
  editFormButton.addEventListener('click', function(event) {
      event.preventDefault();
      const updatedTaskName = document.getElementById('edit-task-name').value;
      const updatedTaskDesc = document.getElementById('edit-task-desc').value;
      
      const newData = { name: updatedTaskName, description: updatedTaskDesc };
      
      PutData(taskId, newData);
      editTaskInList(taskId, newData);

      editForm.reset(); // Restablecer los valores del formulario
      modal.style.display = 'none';
});
}

function editTaskInList (taskId, newData) {
  const { name, description } = newData;
  const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
  if (name) {
    const taskName = taskElement.querySelector('td:nth-child(1)');
    taskName.textContent = name;
  }
  if (description) {
    const taskDesc = taskElement.querySelector('td:nth-child(2)');
    taskDesc.textContent = description;
  }
}

// Eliminar tarea
async function DeleteTask(taskId) {
  const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
  await DeleteData(taskId);
  taskElement.remove();
}

// Completar tarea
async function CompleteTask(taskId) {
  const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
  const statusCell = taskElement.querySelector('td:nth-child(3)');
  statusCell.textContent = 'Completada';

  const newData = { status: 'Completada' };
  await putData(id, newData);
}