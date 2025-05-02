const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configuração do storage para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pets');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error('Apenas imagens são permitidas'));
  }
}).single('profilePicture');

exports.addPet = async (req, res) => {
  try {
    const { name, type, breed, age, apartment } = req.body;
    const ownerId = req.userData.userId;
    const profilePicture = req.file ? `/uploads/pets/${req.file.filename}` : null;
    
    // Adicionar pet
    const [result] = await db.execute(
      'INSERT INTO pets (name, type, breed, age, owner_id, apartment, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, type, breed, parseInt(age), ownerId, apartment, profilePicture]
    );
    
    // Adicionar vacinas, se fornecidas
    if (req.body.vaccines) {
      const vaccines = JSON.parse(req.body.vaccines);
      
      for (const vaccine of vaccines) {
        await db.execute(
          'INSERT INTO vaccines (pet_id, name, date, next_date) VALUES (?, ?, ?, ?)',
          [result.insertId, vaccine.name, vaccine.date, vaccine.nextDate]
        );
      }
    }
    
    return res.status(201).json({
      message: 'Pet adicionado com sucesso',
      petId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao adicionar pet:', error);
    return res.status(500).json({ message: 'Erro ao adicionar pet' });
  }
};

exports.getPets = async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    let query = 'SELECT * FROM pets';
    let params = [];
    
    if (ownerId) {
      query += ' WHERE owner_id = ?';
      params.push(ownerId);
    }
    
    // Buscar pets
    const [pets] = await db.execute(query, params);
    
    // Para cada pet, buscar suas vacinas
    for (const pet of pets) {
      const [vaccines] = await db.execute(
        'SELECT * FROM vaccines WHERE pet_id = ?',
        [pet.id]
      );
      
      pet.vaccines = vaccines;
      
      // Buscar informações do dono
      const [owners] = await db.execute(
        'SELECT id, name, apartment FROM users WHERE id = ?',
        [pet.owner_id]
      );
      
      if (owners.length > 0) {
        pet.owner = owners[0];
      }
    }
    
    return res.status(200).json(pets);
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    return res.status(500).json({ message: 'Erro ao buscar pets' });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const petId = req.params.id;
    
    // Buscar pet
    const [pets] = await db.execute(
      'SELECT * FROM pets WHERE id = ?',
      [petId]
    );
    
    if (pets.length === 0) {
      return res.status(404).json({ message: 'Pet não encontrado' });
    }
    
    const pet = pets[0];
    
    // Buscar vacinas
    const [vaccines] = await db.execute(
      'SELECT * FROM vaccines WHERE pet_id = ?',
      [petId]
    );
    
    pet.vaccines = vaccines;
    
    // Buscar informações do dono
    const [owners] = await db.execute(
      'SELECT id, name, apartment FROM users WHERE id = ?',
      [pet.owner_id]
    );
    
    if (owners.length > 0) {
      pet.owner = owners[0];
    }
    
    return res.status(200).json(pet);
  } catch (error) {
    console.error('Erro ao buscar pet:', error);
    return res.status(500).json({ message: 'Erro ao buscar pet' });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const ownerId = req.userData.userId;
    
    // Verificar se o pet pertence ao usuário
    const [pets] = await db.execute(
      'SELECT * FROM pets WHERE id = ? AND owner_id = ?',
      [petId, ownerId]
    );
    
    if (pets.length === 0) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const { name, type, breed, age, apartment } = req.body;
    const profilePicture = req.file ? `/uploads/pets/${req.file.filename}` : pets[0].profile_picture;
    
    // Atualizar pet
    await db.execute(
      'UPDATE pets SET name = ?, type = ?, breed = ?, age = ?, apartment = ?, profile_picture = ? WHERE id = ?',
      [name, type, breed, parseInt(age), apartment, profilePicture, petId]
    );
    
    // Atualizar vacinas, se fornecidas
    if (req.body.vaccines) {
      const vaccines = JSON.parse(req.body.vaccines);
      
      // Remover vacinas antigas
      await db.execute('DELETE FROM vaccines WHERE pet_id = ?', [petId]);
      
      // Adicionar novas vacinas
      for (const vaccine of vaccines) {
        await db.execute(
          'INSERT INTO vaccines (pet_id, name, date, next_date) VALUES (?, ?, ?, ?)',
          [petId, vaccine.name, vaccine.date, vaccine.nextDate]
        );
      }
    }
    
    return res.status(200).json({
      message: 'Pet atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    return res.status(500).json({ message: 'Erro ao atualizar pet' });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const ownerId = req.userData.userId;
    
    // Verificar se o pet pertence ao usuário
    const [pets] = await db.execute(
      'SELECT * FROM pets WHERE id = ? AND owner_id = ?',
      [petId, ownerId]
    );
    
    if (pets.length === 0) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Remover imagem, se existir
    if (pets[0].profile_picture) {
      const imagePath = path.join(__dirname, '..', pets[0].profile_picture);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Remover vacinas
    await db.execute('DELETE FROM vaccines WHERE pet_id = ?', [petId]);
    
    // Remover pet
    await db.execute('DELETE FROM pets WHERE id = ?', [petId]);
    
    return res.status(200).json({
      message: 'Pet removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover pet:', error);
    return res.status(500).json({ message: 'Erro ao remover pet' });
  }
};