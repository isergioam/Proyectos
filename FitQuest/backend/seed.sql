-- Seed admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@fitquest.com', '$2a$10$l9ytDy.lcao4Sv1ov3BV8.EQt6qODZAKz8aogh1bZcOtFBEsqYBc6', 'admin')
ON DUPLICATE KEY UPDATE role = 'admin';
