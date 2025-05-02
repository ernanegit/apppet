-- Script para criação do banco de dados PetCondo
CREATE DATABASE IF NOT EXISTS petcondo;
USE petcondo;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  apartment VARCHAR(10) NOT NULL,
  profile_picture VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pets
CREATE TABLE IF NOT EXISTS pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('dog', 'cat', 'other') NOT NULL,
  breed VARCHAR(100),
  age INT,
  owner_id INT NOT NULL,
  apartment VARCHAR(10) NOT NULL,
  profile_picture VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de vacinas
CREATE TABLE IF NOT EXISTS vaccines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pet_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  next_date DATE NOT NULL,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- Tabela de incidentes
CREATE TABLE IF NOT EXISTS incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('noise', 'mess', 'behavior') NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(100) NOT NULL,
  status ENUM('pending', 'analyzing', 'resolved') DEFAULT 'pending',
  reporter_id INT NOT NULL,
  reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_date TIMESTAMP NULL,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de tokens de notificação
CREATE TABLE IF NOT EXISTS notification_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Inserir alguns dados de exemplo
INSERT INTO users (name, email, password, apartment) VALUES
('Admin', 'admin@petcondo.com', '$2b$12$1oEbSUQRLUX4xEZpCBW0t.UyWkBcTJTJ8UyjZvHRcBR3kdjYMgUyW', 'ADM'), 
('Ana Silva', 'ana@email.com', '$2b$12$1KsQQ6QEcwRtVq9QpY1JNuBDk5igVTF4KNX7c8vTGnFv5/nf/RHve', '101A'), 
('Carlos Mendes', 'carlos@email.com', '$2b$12$1KsQQ6QEcwRtVq9QpY1JNuBDk5igVTF4KNX7c8vTGnFv5/nf/RHve', '203B');

INSERT INTO pets (name, type, breed, age, owner_id, apartment) VALUES
('Rex', 'dog', 'Golden Retriever', 3, 2, '101A'),
('Mia', 'cat', 'Siamês', 2, 3, '203B');

INSERT INTO vaccines (pet_id, name, date, next_date) VALUES
(1, 'Antirrábica', '2025-01-10', '2026-01-10'),
(1, 'V10', '2025-03-15', '2026-03-15'),
(2, 'Antirrábica', '2025-02-05', '2026-02-05'),
(2, 'V4', '2025-02-20', '2026-02-20');

INSERT INTO incidents (type, description, location, status, reporter_id) VALUES
('noise', 'Cachorro latindo muito alto durante a madrugada', 'Bloco A', 'analyzing', 3),
('mess', 'Fezes de pet não recolhidas na área de lazer', 'Área de lazer', 'resolved', 2),
('behavior', 'Cachorro solto sem coleira no condomínio', 'Bloco B', 'pending', 2);

INSERT INTO messages (sender_id, text) VALUES
(3, 'Olá pessoal! Alguém viu um gato siamês perdido na área da piscina?'),
(2, 'Vi sim! Estava perto do playground. Acho que era seu gato Mia, não era?'),
(3, 'Sim, era ela mesma! Obrigado, vou buscá-la agora.'),
(2, 'Pessoal, estou organizando um passeio coletivo com os cachorros no domingo às 10h. Quem tiver interesse, é só me avisar!');