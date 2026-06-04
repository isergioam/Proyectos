import { get, post, patch } from './http'

function fetchPrestamos() {
    return get('/prestamos')
}

function createPrestamo(payload) {
    return post('/prestamos', payload)
}

function devolverPrestamo(id) {
    return patch(`/prestamos/${id}/devolver`, {})
}

export {
    fetchPrestamos,
    createPrestamo,
    devolverPrestamo
}