const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskPriority = document.getElementById('taskPriority');
const taskDeadline = document.getElementById('taskDeadline');
const taskStatus = document.getElementById('taskStatus');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = "./Login.html";
});

const token = localStorage.getItem('authToken');
if (!token) {
  window.location.href = "./Login.html";
}

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

window.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
  try {
    const response = await axios.get('/tasks');
    const tasks = response.data;
    tasks.forEach(renderTask);
  } catch (error) {
    handleAxiosError(error, 'Failed to load tasks');
  }
}

async function addTask() {
  const newTask = {
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    priority: taskPriority.value,
    deadline: taskDeadline.value || null,
    status: taskStatus.value,
  };

  if (!newTask.title) {
    displayError('Task title cannot be empty');
    return;
  }

  try {
    const response = await axios.post('/tasks', newTask);
    renderTask(response.data);
    clearInputs();
  } catch (error) {
    handleAxiosError(error, 'Failed to add task');
  }
}

async function deleteTask(id) {
  try {
    await axios.delete(`/tasks/${id}`);
    document.getElementById(`task-${id}`).remove();
  } catch (error) {
    handleAxiosError(error, 'Failed to delete task');
  }
}

function renderTask(task) {
  const li = document.createElement('li');
  li.id = `task-${task._id}`;
  li.className = 'flex flex-col p-2 bg-white border border-green-500 rounded space-y-2';

  li.innerHTML = `
    <div>
      <strong>Title:</strong> <span class="task-title">${task.title}</span>
      <input type="text" class="edit-input hidden w-full p-2 border border-green-500 rounded" value="${task.title}" />
    </div>
    <div><strong>Description:</strong> ${task.description || 'N/A'}</div>
    <div><strong>Priority:</strong> ${task.priority}</div>
    <div><strong>Deadline:</strong> ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</div>
    <div><strong>Status:</strong> ${task.status}</div>
    <div class="flex space-x-2">
      <button class="edit-btn text-blue-500 hover:text-blue-700" data-id="${task._id}">Edit</button>
      <button class="save-btn hidden text-green-500 hover:text-green-700" data-id="${task._id}">Save</button>
      <button class="delete-btn text-red-500 hover:text-red-700" data-id="${task._id}">Delete</button>
    </div>
  `;
  taskList.appendChild(li);
}

// Event delegation for edit, save, and delete buttons
taskList.addEventListener('click', (event) => {
  const taskId = event.target.getAttribute('data-id');

  // Handle Edit button click
  if (event.target.classList.contains('edit-btn')) {
    const taskItem = document.getElementById(`task-${taskId}`);
    taskItem.querySelector('.task-title').classList.add('hidden');
    taskItem.querySelector('.edit-input').classList.remove('hidden');
    taskItem.querySelector('.edit-btn').classList.add('hidden');
    taskItem.querySelector('.save-btn').classList.remove('hidden');
  }

  // Handle Save button click
  if (event.target.classList.contains('save-btn')) {
    const taskItem = document.getElementById(`task-${taskId}`);
    const updatedTitle = taskItem.querySelector('.edit-input').value.trim();
    if (updatedTitle) {
      updateTask(taskId, { title: updatedTitle });
    } else {
      displayError('Task title cannot be empty');
    }
  }

  // Handle Delete button click
  if (event.target.classList.contains('delete-btn')) {
    deleteTask(taskId);
  }
});

async function updateTask(id, updates) {
  try {
    const response = await axios.put(`/tasks/${id}`, updates);
    const updatedTask = response.data;

    const taskItem = document.getElementById(`task-${id}`);
    taskItem.querySelector('.task-title').textContent = updatedTask.title;
    taskItem.querySelector('.task-title').classList.remove('hidden');
    taskItem.querySelector('.edit-input').classList.add('hidden');
    taskItem.querySelector('.edit-btn').classList.remove('hidden');
    taskItem.querySelector('.save-btn').classList.add('hidden');
  } catch (error) {
    console.log(error)
    handleAxiosError(error, 'Failed to update task');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',error)
    
  }
}

function displayError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'text-red-600 bg-red-100 p-2 rounded my-2';
  errorDiv.innerText = message;
  taskList.insertAdjacentElement('beforebegin', errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}

function handleAxiosError(error, defaultMessage) {
  if (error.response) {
    displayError(`Error: ${error.response.status} - ${error.response.data.message || defaultMessage}`);
  } else if (error.request) {
    displayError('No response from server. Please try again.');
  } else {
    displayError(`Error: ${error.message || defaultMessage}`);
  }
}

function clearInputs() {
  taskTitle.value = '';
  taskDescription.value = '';
  taskPriority.value = 'low';
  taskDeadline.value = '';
  taskStatus.value = 'pending';
}

addTaskBtn.addEventListener('click', addTask);
