const db = require('../config/db');

exports.registerToken = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.userData.userId;
    
    // Verificar se o token já existe
    const [existingTokens] = await db.execute(
      'SELECT * FROM notification_tokens WHERE user_id = ? AND token = ?',
      [userId, token]
    );
    
    if (existingTokens.length > 0) {
      return res.status(200).json({
        message: 'Token já registrado'
      });
    }
    
    // Registrar token
    await db.execute(
      'INSERT INTO notification_tokens (user_id, token) VALUES (?, ?)',
      [userId, token]
    );
    
    return res.status(201).json({
      message: 'Token registrado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao registrar token:', error);
    return res.status(500).json({ message: 'Erro ao registrar token' });
  }
};

exports.unregisterToken = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.userData.userId;
    
    // Remover token
    await db.execute(
      'DELETE FROM notification_tokens WHERE user_id = ? AND token = ?',
      [userId, token]
    );
    
    return res.status(200).json({
      message: 'Token removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover token:', error);
    return res.status(500).json({ message: 'Erro ao remover token' });
  }
};

// Esta função seria chamada por um job agendado para verificar vacinas
exports.checkVaccines = async () => {
  try {
    const daysAhead = 7; // Alertar 7 dias antes do vencimento
    
    // Buscar vacinas que vencem nos próximos 7 dias
    const [vaccines] = await db.execute(
      'SELECT vaccines.*, pets.name as pet_name, pets.owner_id, users.name as owner_name ' +
      'FROM vaccines ' +
      'JOIN pets ON vaccines.pet_id = pets.id ' +
      'JOIN users ON pets.owner_id = users.id ' +
      'WHERE DATEDIFF(vaccines.next_date, CURDATE()) <= ?',
      [daysAhead]
    );
    
    // Para cada vacina, enviar notificação ao dono
    for (const vaccine of vaccines) {
      const [tokens] = await db.execute(
        'SELECT token FROM notification_tokens WHERE user_id = ?',
        [vaccine.owner_id]
      );
      
      // Aqui você enviaria as notificações usando Firebase Cloud Messaging ou outra plataforma
      console.log(`Notificação de vacina para ${vaccine.owner_name}: ${vaccine.pet_name} precisa tomar a vacina ${vaccine.name} em breve.`);
    }
    
    return vaccines;
  } catch (error) {
    console.error('Erro ao verificar vacinas:', error);
    throw error;
  }
};