// Funciones para el consumo de la API

const headers = {
    'Content-Type': 'application/json',
}

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


// Path: FrontEnd\js\home.js
// Formulario de tareas (Crear Tareas)

const BtnAddTask = document.getElementById('btn-submit');
BtnAddTask.addEventListener('click', createTask);

const GetDataFromForm = () => {  
    const name = document.getElementById('task-name').value
    const description = document.getElementById('task-desc').value
    const status = document.querySelector('input[name="task-status"]:checked').value;
    const data = { name, description, status }
    return data
}

async function createTask() {
  const form = document.getElementById('task-form');
  const data = GetDataFromForm();
  const { name, description, status } = data;
  await PostData(name, description, status);
  form.reset(); // Restablecer los valores del formulario
  UpdateList();
}

const getTaskId = async (event) => {
    const editButton = event.target;
    const row = editButton.closest('tr');
    const taskId = row.dataset.id
    return taskId
}

async function OpenEditWin(event) {
    const id = await getTaskId(event);
    const modal = document.getElementById('edit-modal');
    const closeButton = document.querySelector('.close');
    const editFormButton = document.getElementById('btn-update');
    const editForm = document.getElementById('edit-form');

    modal.style.display = 'block';

    closeButton.addEventListener('click', () => { modal.style.display = 'none' });
    editFormButton.addEventListener('click', function(event) {
        event.preventDefault();

        const updatedTaskName = document.getElementById('edit-task-name').value;
        const updatedTaskDesc = document.getElementById('edit-task-desc').value;
        
        const newData = { name: updatedTaskName, description: updatedTaskDesc };
        UpdateData(id, newData);
        editForm.reset(); // Restablecer los valores del formulario
        modal.style.display = 'none';    
});
}






// Edit Modal Window 



// Agrega el evento clic al área fuera del modal para ocultarlo
window.addEventListener('click', function(event) {
  const modal = document.getElementById('edit-modal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});








var tasks = [
    {
      id: 1,
      title: "Tarea 1",
      description: "Descripción de la tarea 1",
      status: "Pendiente",
      date: "2023-05-20"
    },
    {
      id: 2,
      title: "Tarea 2",
      description: "Descripción de la tarea 2",
      status: "Completada",
      date: "2023-05-21"
    },
    // Agrega más tareas según sea necesario
  ];


// Variables globales
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Event listeners
taskForm.addEventListener('submit', addTask);
document.addEventListener('DOMContentLoaded', UpdateList); // Nuevo evento

// Función para agregar una tarea
function addTask(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const taskName = document.getElementById('task-name').value;
  const taskDesc = document.getElementById('task-desc').value;
  const taskStatus = document.getElementById('task-status').value;

  // Crear un nuevo objeto de tarea
  const task = {
    name: taskName,
    description: taskDesc,
    status: taskStatus,
    date: getCurrentDate()
  };

  // Agregar la tarea a la lista
  taskList.appendChild(createTaskElement(task));

  // Limpiar el formulario
  taskForm.reset();
}

// Función para crear un elemento de tarea
// Función para crear un elemento de tarea
function createTaskElement(task) {
    const taskRow = document.createElement('tr');
    taskRow.classList.add('task-item');
    taskRow.dataset.id = task.id;
  
    const titleCell = document.createElement('td');
    titleCell.textContent = task.title;
    taskRow.appendChild(titleCell);
  
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = task.description;
    taskRow.appendChild(descriptionCell);
  
    const statusCell = document.createElement('td');
    statusCell.textContent = task.status;
    taskRow.appendChild(statusCell);
  
    const dateCell = document.createElement('td');
    dateCell.textContent = task.date;
    taskRow.appendChild(dateCell);
  
    const actionsCell = document.createElement('td');
    actionsCell.classList.add('actions');
    actionsCell.innerHTML = `
      <button class="delete-btn">Eliminar</button>
      <button class="edit-btn">Editar</button>
      <button class="complete-btn">Completar</button>
    `;
    
    const editButton = actionsCell.querySelector('.edit-btn');
    editButton.addEventListener('click', OpenEditWin);

    taskRow.appendChild(actionsCell);
  
    return taskRow;
}
  

// Función para llenar la lista de tareas (Nuevo)
function UpdateList() {
  tasks.forEach(task => {
    taskList.appendChild(createTaskElement(task));
  });
}
