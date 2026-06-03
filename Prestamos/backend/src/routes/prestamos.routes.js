const express = require('express')
const prestamosController = require('../controllers/prestamos.controller')

const router = express.Router()

router.get('/', prestamosController.listPrestamos)
router.post('/', prestamosController.createPrestamo)
router.patch('/:id/devolver', prestamosController.devolverPrestamo)

module.exports = router