const express = require('express')
const objetosController = require('../controllers/objetos.controller')

const router = express.Router()

router.get('/', objetosController.listObjetos)
router.post('/', objetosController.createObjeto)
router.delete('/:id', objetosController.deleteObjeto)

module.exports = router