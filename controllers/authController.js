// Crie um arquivo em controllers/authController.js com o seguinte conteúdo:
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, password, apartment } = req.body;
    
    // Verificar se o email já existe
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }
    
    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Inserir usuário
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, apartment) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, apartment]
    );
    
    // Gerar token
    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );
    
    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      userId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const user = users[0];
    
    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );
    
    return res.status(200).json({
      token,
      userId: user.id,
      name: user.name,
      apartment: user.apartment
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userData.userId;
    
    // Buscar usuário
    const [users] = await db.execute(
      'SELECT id, name, email, apartment, profile_picture, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    return res.status(200).json(users[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
};