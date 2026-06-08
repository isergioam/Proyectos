const objetosModel = require('../models/objetos.model')

async function listObjetos(req, res) {
    try {
        const objetos = await objetosModel.getAllObjetos()

        res.status(200).json(objetos)
    } catch (error) {
        console.error('Error al listar objetos:', error)

        res.status(500).json({
            error: 'Se produjo un error al listar los objetos.'
        })
    }
}

async function createObjeto(req, res) {
    try {
        const nombre = (req.body.nombre || '').trim()
        const descripcion = (req.body.descripcion || '').trim()
        const prestamista_nombre = (req.body.prestamista_nombre || '').trim()

        if (!nombre) {
            return res.status(400).json({
                error: 'El nombre del objeto es obligatorio.'
            })
        }

        if (prestamista_nombre.length > 120) {
            return res.status(400).json({
                error: 'El prestamista no puede superar los 120 caracteres.'
            })
        }

        if (nombre.length > 120) {
            return res.status(400).json({
                error: 'El nombre del objeto no puede superar los 120 caracteres.'
            })
        }

        if (descripcion.length > 255) {
            return res.status(400).json({
                error: 'La descripción no puede superar los 255 caracteres.'
            })
        }

        const objeto = await objetosModel.createObjeto({
            nombre,
            descripcion,
            prestamista_nombre
        })

        res.status(201).json(objeto)
    } catch (error) {
        console.error('Error al crear objeto:', error)

        res.status(500).json({
            error: 'Se produjo un error al crear el objeto.'
        })
    }
}

async function deleteObjeto(req, res) {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id) || id <= 0) {
            return res.status(400).json({
                error: 'El id del objeto no es válido.'
            })
        }

        const objeto = await objetosModel.getObjetoById(id)

        if (!objeto) {
            return res.status(404).json({
                error: 'No existe un objeto con ese id.'
            })
        }

        if (objeto.estado === 'PRESTADO') {
            return res.status(409).json({
                error: 'No se puede borrar un objeto prestado.'
            })
        }

        await objetosModel.deleteObjetoById(id)

        res.status(200).json({
            message: 'Objeto eliminado correctamente.'
        })
    } catch (error) {
        console.error('Error al borrar objeto:', error)

        res.status(500).json({
            error: 'Se produjo un error al borrar el objeto.'
        })
    }
}

module.exports = {
    listObjetos,
    createObjeto,
    deleteObjeto
}