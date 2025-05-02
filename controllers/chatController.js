const db = require('../config/db');

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const senderId = req.userData.userId;
    
    // Enviar mensagem
    const [result] = await db.execute(
      'INSERT INTO messages (sender_id, text) VALUES (?, ?)',
      [senderId, text]
    );
    
    return res.status(201).json({
      message: 'Mensagem enviada com sucesso',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return res.status(500).json({ message: 'Erro ao enviar mensagem' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    // Buscar mensagens
    const [messages] = await db.execute(
      'SELECT messages.*, users.name as sender_name, users.apartment as sender_apartment, users.profile_picture as sender_picture ' +
      'FROM messages ' +
      'JOIN users ON messages.sender_id = users.id ' +
      'ORDER BY timestamp ASC'
    );
    
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
};