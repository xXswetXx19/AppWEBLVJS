// Variables respectivas a la API
const headers = {
    'Content-Type': 'application/json',
}
// Funciones para el consumo de la API
const PostData = async (name, description, status) => {
    const task = JSON.stringify({ name, description, status })
    const response = await fetch('http://localhost:8000/api/task/', {
        method: 'POST',
        headers,
        body: task,
    })
    const data = await response.json()
    return data
}

const GetData = async (id) => {
    const response = await fetch(`http://localhost:8000/api/task/${id ? id : ''}`)
    const data = await response.json()
    return data
}
const PutData = async (id, data) => {
    const response = await fetch(`http://localhost:8000/api/task/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  
    const responseData = await response.json();
    return responseData;
  };
  
  
const DeleteData = async (id) => {
    const response = await fetch(`http://localhost:8000/api/task/${id}`, {
        method: 'DELETE',
    })
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

// Funciones para la lista de tareas
async function getTasks() {
  const tasks = await GetData();  
  return tasks;
}

// Llenando la tabla con las tareas
function createTaskElement(task) {
    const taskRow = document.createElement('tr');
    taskRow.classList.add('task-item');
    taskRow.dataset.id = task.id;
  
    const titleCell = document.createElement('td');
    titleCell.textContent = task.name;
    taskRow.appendChild(titleCell);
  
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = task.description;
    taskRow.appendChild(descriptionCell);
  
    const statusCell = document.createElement('td');
    statusCell.textContent = task.status;
    taskRow.appendChild(statusCell);
  
    const dateCell = document.createElement('td');
    dateCell.textContent = task.created_at;
    taskRow.appendChild(dateCell);
  
    const actionsCell = document.createElement('td');
    actionsCell.classList.add('actions');
    actionsCell.innerHTML = `
      <button class="delete-btn">Eliminar</button>
      <button class="edit-btn">Editar</button>
      <button class="complete-btn">Completar</button>
    `;
    
    // Obteniendo los botones de la fila de la tarea
    const editButton = actionsCell.querySelector('.edit-btn');
    const deleteButton = actionsCell.querySelector('.delete-btn');
    const completeButton = actionsCell.querySelector('.complete-btn');

    // Eventos para los botones de la fila de la tarea 
    editButton.addEventListener('click', OpenEditWin);
    deleteButton.addEventListener('click', DeleteTask);
    completeButton.addEventListener('click', CompleteTask);    

    // Agreando los botones a la fila de la tarea
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
  const tasks = await getTasks();
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
const getTaskId = async (event) => {
  const editButton = event.target;
  const row = editButton.closest('tr');
  const taskId = row.dataset.id
  return taskId
}

async function OpenEditWin(event) {
  const id = await getTaskId(event);

  // Obteniendo los elementos del modal
  const modal = document.getElementById('edit-modal');
  const closeButton = document.querySelector('.close');
  const editFormButton = document.getElementById('btn-update');
  const editForm = document.getElementById('edit-form');

  // Obteniendo los datos de la tarea a editar
  const task = document.querySelector(`[data-id="${id}"]`);
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
      
      PutData(id, newData);
      editTaskInList(id, newData);

      editForm.reset(); // Restablecer los valores del formulario
      modal.style.display = 'none';
});
}


function editTaskInList (Id, newData) {
  const { name, description } = newData;
  const task = document.querySelector(`[data-id="${Id}"]`);
  if (name) {
    const taskName = task.querySelector('td:nth-child(1)');
    taskName.textContent = name;
  }
  if (description) {
    const taskDesc = task.querySelector('td:nth-child(2)');
    taskDesc.textContent = description;
  }
}















// Eliminar tarea
async function DeleteTask(event) {
  const taskId = await getTaskId(event);
  const task = document.querySelector(`[data-id="${taskId}"]`);
  await DeleteData(taskId);
  task.remove();

}

// Completar tarea
async function CompleteTask(event) {
  const taskId = await getTaskId(event);
  const task = document.querySelector(`[data-id="${taskId}"]`);
  const taskStatus = task.querySelector('td:nth-child(3)');
  const newStatus = 'Completada' 
  const newData = { status: newStatus };
  await PutData(taskId, newData);
  taskStatus.textContent = newStatus;
}