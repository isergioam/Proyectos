const { body } = require('express-validator');

const registerValidation = [
  body('username')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email no valido'),
  body('password')
    .notEmpty().withMessage('La contrasena es obligatoria')
    .isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres'),
];

const loginValidation = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email no valido'),
  body('password')
    .notEmpty().withMessage('La contrasena es obligatoria'),
];

module.exports = { registerValidation, loginValidation };
