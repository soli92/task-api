const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (per semplicità, in produzione useresti un DB vero)
let tasks = [
  { id: 1, title: 'Task di esempio', description: 'Questa è una task di test', completed: false, createdAt: new Date().toISOString() }
];
let nextId = 2;

// Utility per trovare task per ID
const findTaskById = (id) => tasks.find(task => task.id === parseInt(id));

// ========== ROUTES ==========

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task API is running! 🚀',
    endpoints: {
      'GET /tasks': 'Get all tasks',
      'GET /tasks/:id': 'Get task by ID',
      'POST /tasks': 'Create new task',
      'PUT /tasks/:id': 'Update task',
      'DELETE /tasks/:id': 'Delete task'
    }
  });
});

// GET /tasks - Ottieni tutte le task
app.get('/tasks', (req, res) => {
  try {
    const { completed } = req.query;
    
    let filteredTasks = tasks;
    
    // Filtro opzionale per stato completed
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      filteredTasks = tasks.filter(task => task.completed === isCompleted);
    }
    
    res.json({
      success: true,
      count: filteredTasks.length,
      data: filteredTasks
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /tasks/:id - Ottieni una task specifica
app.get('/tasks/:id', (req, res) => {
  try {
    const task = findTaskById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: 'Task non trovata' 
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /tasks - Crea una nuova task
app.post('/tasks', (req, res) => {
  try {
    const { title, description, completed } = req.body;
    
    // Validazione
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Il campo title è obbligatorio' 
      });
    }
    
    const newTask = {
      id: nextId++,
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: completed || false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    res.status(201).json({
      success: true,
      message: 'Task creata con successo',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /tasks/:id - Aggiorna una task esistente
app.put('/tasks/:id', (req, res) => {
  try {
    const task = findTaskById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: 'Task non trovata' 
      });
    }
    
    const { title, description, completed } = req.body;
    
    // Validazione
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Il campo title non può essere vuoto' 
      });
    }
    
    // Aggiorna solo i campi forniti
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (completed !== undefined) task.completed = completed;
    task.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Task aggiornata con successo',
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /tasks/:id - Elimina una task
app.delete('/tasks/:id', (req, res) => {
  try {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));
    
    if (taskIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Task non trovata' 
      });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Task eliminata con successo',
      data: deletedTask
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route non trovata
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint non trovato' 
  });
});

// Error handler globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Errore interno del server' 
  });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}`);
});
