const { body } = require('express-validator');

const challengeValidation = [
  body('title')
    .notEmpty().withMessage('El titulo es obligatorio'),
  body('duration_days')
    .notEmpty().withMessage('La duracion es obligatoria')
    .isInt({ min: 1 }).withMessage('La duracion debe ser un numero entero positivo'),
  body('difficulty')
    .notEmpty().withMessage('La dificultad es obligatoria')
    .isIn(['facil', 'intermedio', 'dificil']).withMessage('Dificultad no valida'),
];

module.exports = { challengeValidation };
