const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Rotas
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const incidentRoutes = require('./routes/incidents');
const chatRoutes = require('./routes/chat');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.send('API do PetCondo funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
