const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    })

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await response.json() : null

    if (!response.ok) {
        const message = data?.error || 'Se produjo un error en la petición.'
        throw new Error(message)
    }

    return data
}

function get(path) {
    return request(path, {
        method: 'GET'
    })
}

function post(path, body) {
    return request(path, {
        method: 'POST',
        body: JSON.stringify(body)
    })
}

function patch(path, body) {
    return request(path, {
        method: 'PATCH',
        body: JSON.stringify(body)
    })
}

function del(path) {
    return request(path, {
        method: 'DELETE'
    })
}

export { get, post, patch, del }