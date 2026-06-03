import { get, post, del } from './http'

function fetchObjetos() {
    return get('/objetos')
}

function createObjeto(payload) {
    return post('/objetos', payload)
}

function deleteObjeto(id) {
    return del(`/objetos/${id}`)
}

export {
    fetchObjetos,
    createObjeto,
    deleteObjeto
}