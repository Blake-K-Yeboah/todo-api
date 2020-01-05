const express = require('express');

const app = express();

app.get('/', (req, res) => res.send("Request /api/todos to see todos"));

// Todo Api Routes
app.use('/api/todos', require('./routes/api/Todos'));

const port = 5000;

app.listen(port, () => console.log(`Server Running on port: ${port}`));