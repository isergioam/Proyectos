-- sql/init.sql
-- Base de datos: recetas_db

DROP DATABASE IF EXISTS recetas_db;
CREATE DATABASE recetas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE recetas_db;

-- Usuarios: sin login, se identifican por email (único)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recetas
CREATE TABLE recetas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  autor_id INT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  pasos TEXT NOT NULL,
  tiempo_min INT NULL,
  dificultad ENUM('facil','media','dificil') NOT NULL DEFAULT 'media',
  porciones INT NULL,
  foto_url VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_recetas_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Ingredientes (catálogo global)
CREATE TABLE ingredientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE
);

-- Relación N–M receta-ingrediente con atributos extra
CREATE TABLE receta_ingredientes (
  receta_id INT NOT NULL,
  ingrediente_id INT NOT NULL,
  cantidad DECIMAL(10,2) NULL,
  unidad VARCHAR(30) NULL,
  PRIMARY KEY (receta_id, ingrediente_id),
  CONSTRAINT fk_ri_receta FOREIGN KEY (receta_id) REFERENCES recetas(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ri_ing FOREIGN KEY (ingrediente_id) REFERENCES ingredientes(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Comentarios (separados de valoraciones)
CREATE TABLE comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  receta_id INT NOT NULL,
  usuario_id INT NOT NULL,
  texto VARCHAR(800) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_com_receta FOREIGN KEY (receta_id) REFERENCES recetas(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_com_user FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Valoraciones (1 por usuario y receta)
CREATE TABLE valoraciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  receta_id INT NOT NULL,
  usuario_id INT NOT NULL,
  estrellas TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_estrellas CHECK (estrellas BETWEEN 1 AND 5),
  CONSTRAINT uq_val UNIQUE (receta_id, usuario_id),
  CONSTRAINT fk_val_receta FOREIGN KEY (receta_id) REFERENCES recetas(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_val_user FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Algunos ingredientes de ejemplo (opcionales)
INSERT INTO ingredientes (nombre) VALUES
('Sal'),('Aceite de oliva'),('Ajo'),('Tomate'),('Pasta'),('Cebolla'),('Pimienta');

-- Usuario demo (opcional)
INSERT INTO usuarios (nombre, email) VALUES ('Chef Demo', 'demo@recetas.com');

