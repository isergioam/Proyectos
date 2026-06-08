const prestamosModel = require('../models/prestamos.model')
const objetosModel = require('../models/objetos.model')
const httpError = require('../utils/httpError')
const { isNonEmptyString, isPositiveInteger } = require('../utils/validate')
const { getTodayIsoDate } = require('../utils/date')

async function listPrestamos(req, res) {
    try {
        const prestamos = await prestamosModel.getAllPrestamos()

        res.status(200).json(prestamos)
    } catch (error) {
        console.error('Error al listar prestamos:', error)

        res.status(500).json({
            error: 'Se produjo un error al listar los prestamos.'
        })
    }
}

async function createPrestamo(req, res) {
    try {
        const {
            objeto_id,
            prestamista_nombre,
            prestatario_nombre,
            fecha_prestamo,
            fecha_devolucion_prevista,
            notas
        } = req.body

        if (!isPositiveInteger(objeto_id)) {
            throw httpError(400, 'El objeto_id no es válido.')
        }

        if (!isNonEmptyString(prestamista_nombre)) {
            throw httpError(400, 'El nombre del prestamista es obligatorio.')
        }

        if (!isNonEmptyString(prestatario_nombre)) {
            throw httpError(400, 'El nombre del prestatario es obligatorio.')
        }

        if (!isNonEmptyString(fecha_prestamo)) {
            throw httpError(400, 'La fecha de prestamo es obligatoria.')
        }

        if (prestamista_nombre.trim().length > 120) {
            throw httpError(400, 'El nombre del prestamista no puede superar los 120 caracteres.')
        }

        if (prestatario_nombre.trim().length > 120) {
            throw httpError(400, 'El nombre del prestatario no puede superar los 120 caracteres.')
        }

        if ((notas || '').trim().length > 255) {
            throw httpError(400, 'Las notas no pueden superar los 255 caracteres.')
        }

        const objeto = await objetosModel.getObjetoById(Number(objeto_id))

        if (!objeto) {
            throw httpError(404, 'No existe un objeto con ese id.')
        }

        if (objeto.estado === 'PRESTADO') {
            throw httpError(409, 'Ese objeto ya esta prestado.')
        }

        const prestamo = await prestamosModel.createPrestamo({
            objetoId: Number(objeto_id),
            prestamistaNombre: prestamista_nombre.trim(),
            prestatarioNombre: prestatario_nombre.trim(),
            fechaPrestamo: fecha_prestamo,
            fechaDevolucionPrevista: fecha_devolucion_prevista || null,
            notas: (notas || '').trim()
        })

        await prestamosModel.updateObjetoEstado(Number(objeto_id), 'PRESTADO')

        res.status(201).json(prestamo)
    } catch (error) {
        console.error('Error al crear prestamo:', error)

        res.status(error.status || 500).json({
            error: error.message || 'Se produjo un error al crear el prestamo.'
        })
    }
}

async function devolverPrestamo(req, res) {
    try {
        const id = Number(req.params.id)

        if (!isPositiveInteger(id)) {
            throw httpError(400, 'El id del prestamo no es válido.')
        }

        const prestamo = await prestamosModel.getPrestamoById(id)

        if (!prestamo) {
            throw httpError(404, 'No existe un prestamo con ese id.')
        }

        if (prestamo.estado === 'DEVUELTO') {
            throw httpError(409, 'Ese prestamo ya estaba devuelto.')
        }

        const fechaDevolucionReal = getTodayIsoDate()

        await prestamosModel.markPrestamoAsDevuelto(id, fechaDevolucionReal)
        await prestamosModel.updateObjetoEstado(prestamo.objeto_id, 'DISPONIBLE')

        const prestamoActualizado = await prestamosModel.getPrestamoById(id)

        res.status(200).json(prestamoActualizado)
    } catch (error) {
        console.error('Error al devolver prestamo:', error)

        res.status(error.status || 500).json({
            error: error.message || 'Se produjo un error al devolver el prestamo.'
        })
    }
}

module.exports = {
    listPrestamos,
    createPrestamo,
    devolverPrestamo
}