const { body } = require('express-validator');

const progressValidation = [
  body('challenge_id')
    .notEmpty().withMessage('El reto es obligatorio')
    .isInt().withMessage('ID de reto no valido'),
  body('value')
    .notEmpty().withMessage('El valor es obligatorio')
    .isFloat({ min: 0 }).withMessage('El valor debe ser un numero positivo'),
  body('log_date')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isDate().withMessage('Fecha no valida'),
];

module.exports = { progressValidation };
