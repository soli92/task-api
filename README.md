# Task API 📝

API REST completa per la gestione di task con operazioni CRUD.

## 🚀 Tecnologie

- Node.js
- Express.js
- CORS abilitato

## 📋 Endpoints

### Health Check
```
GET /
```

### Ottieni tutte le task
```
GET /tasks
GET /tasks?completed=true  (filtra per stato)
```

### Ottieni una task specifica
```
GET /tasks/:id
```

### Crea una nuova task
```
POST /tasks
Content-Type: application/json

{
  "title": "Titolo task",
  "description": "Descrizione opzionale",
  "completed": false
}
```

### Aggiorna una task
```
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Nuovo titolo",
  "description": "Nuova descrizione",
  "completed": true
}
```

### Elimina una task
```
DELETE /tasks/:id
```

## 🛠️ Installazione locale

```bash
# Installa dipendenze
npm install

# Avvia in development
npm run dev

# Avvia in production
npm start
```

## 📝 Formato risposte

Tutte le risposte seguono questo schema:

```json
{
  "success": true,
  "data": { ... },
  "message": "Messaggio opzionale"
}
```

## ⚙️ Variabili d'ambiente

Copia `.env.example` in `.env` e configura:

```
PORT=3000
```

## 📦 Deploy

Deployato su Railway con auto-deploy da GitHub.

## 🔒 Note

L'API usa un database in-memory per semplicità. Per un uso in produzione, considera l'integrazione con PostgreSQL, MongoDB o altro database persistente.
