const btnSubmit = document.getElementById('btn-submit');
// Asociar evento de clic al botón de envío
btnSubmit.addEventListener('click', createTask);

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
}



const PostData = async (name, description, status) => {
    const response = await fetch('http://localhost:8000/api/task/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, status }),
    })
    const data = await response.json()
    return data
}

const GetData = async () => {
    const response = await fetch('http://localhost:8000/api/task/')
    const data = await response.json()
    return data
}
const PutData = async (id) => {
    const response = await fetch(`http://localhost:8000/api/task/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'New title', description: "Descripcion perrona", status: "activo" }),
    })
    const data = await response.json()
    return data
}


const DeleteData = async (id) => {
    const response = await fetch(`http://localhost:8000/api/task/${id}`, {
        method: 'DELETE',
    })
    const data = await response.json()
    return data
}



