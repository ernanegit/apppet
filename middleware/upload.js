const multer = require('multer');
const path = require('path');

// Configuração do storage para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define o destino com base no tipo de arquivo
    if (file.fieldname === 'profilePicture') {
      cb(null, 'uploads/pets');
    } else {
      cb(null, 'uploads');
    }
  },
  filename: (req, file, cb) => {
    // Gera um nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para verificar tipos de arquivo
const fileFilter = (req, file, cb) => {
  // Aceita apenas imagens
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Apenas imagens são permitidas.'), false);
  }
};

// Configurações do multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
