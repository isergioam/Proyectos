const formatPrice = (price) => {
    return `${Number(price).toFixed(2)} €`
}

const buildProductsContext = (products) => {
    return products.map((product) => {
        return [
            `ID: ${product.id}`,
            `Nombre: ${product.name}`,
            `Categoría: ${product.category_name || 'Sin categoría'}`,
            `Precio: ${formatPrice(product.price)}`,
            `Stock: ${product.stock}`,
            `Descripción: ${product.description || 'Sin descripción'}`
        ].join('\n')
    }).join('\n---\n')
}

const callOllama = async (prompt) => {
    const response = await fetch(process.env.OLLAMA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: process.env.OLLAMA_MODEL,
            prompt,
            stream: false
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || 'Error al consultar Ollama')
    }

    return data.response
}

const callGemini = async (prompt) => {
    const apiKey = process.env.GEMINI_API_KEY
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash'

    if (!apiKey) {
        throw new Error('Falta GEMINI_API_KEY en el archivo .env')
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error?.message || 'Error al consultar Gemini')
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No he podido generar una respuesta.'
}

const callProvider = async ({ prompt, mockAnswer }) => {
    const provider = process.env.AI_PROVIDER || 'mock'

    if (provider === 'mock') {
        return mockAnswer
    }

    if (provider === 'ollama') {
        return callOllama(prompt)
    }

    if (provider === 'gemini') {
        return callGemini(prompt)
    }

    throw new Error(`Proveedor de IA no soportado: ${provider}`)
}

export const generateRecommendation = async ({ message, products }) => {
    const productsContext = buildProductsContext(products)

    const prompt = `
Eres un asistente de compra de una tienda online.

Debes recomendar productos usando únicamente el catálogo proporcionado.

Reglas obligatorias:
- No inventes productos.
- No recomiendes productos que no estén en el catálogo.
- Recomienda como máximo 3 productos.
- Explica brevemente por qué recomiendas cada producto.
- Si no hay ningún producto adecuado, dilo claramente.
- No prometas descuentos, garantías ni envíos.
- Responde en español.

Catálogo disponible:
${productsContext}

Necesidad del usuario:
${message}
`

    const mockAnswer = products
        .slice(0, 3)
        .map((product) => `Te recomiendo ${product.name}, con precio ${formatPrice(product.price)}, porque puede encajar con la necesidad indicada.`)
        .join('\n\n')

    return callProvider({ prompt, mockAnswer })
}

export const generateBudgetAdvice = async ({ message, budget, products }) => {
    const productsContext = buildProductsContext(products)

    const prompt = `
Eres un asesor de compra de una tienda online.

El usuario tiene un presupuesto máximo de ${formatPrice(budget)}.

Debes recomendar productos usando únicamente el catálogo proporcionado.

Reglas obligatorias:
- No inventes productos.
- No recomiendes productos fuera del catálogo.
- No superes el presupuesto indicado.
- Si recomiendas varios productos, explica por qué combinan bien.
- Si el presupuesto no permite una recomendación útil, dilo claramente.
- Responde en español.

Catálogo disponible:
${productsContext}

Necesidad del usuario:
${message}
`

    const mockAnswer = products
        .slice(0, 3)
        .map((product) => `${product.name} cuesta ${formatPrice(product.price)} y entra dentro del presupuesto.`)
        .join('\n')

    return callProvider({ prompt, mockAnswer })
}

export const generateProductDescription = async ({ name, category, features }) => {
    const prompt = `
Eres un redactor profesional de fichas de producto para una tienda online.

Crea una descripción comercial clara y útil.

Datos disponibles:
- Nombre: ${name}
- Categoría: ${category || 'No indicada'}
- Características: ${features || 'No indicadas'}

Reglas:
- No inventes características técnicas concretas.
- No prometas descuentos, garantías ni envíos.
- Escribe en español.
- Usa un tono profesional.
- Máximo 90 palabras.
`

    const mockAnswer = `${name} es una opción práctica y fiable${category ? ` dentro de la categoría ${category}` : ''}. ${features ? `Destaca por ${features}.` : 'Está pensado para usuarios que buscan una solución sencilla y funcional.'}`

    return callProvider({ prompt, mockAnswer })
}

export const generateProductComparison = async ({ firstProduct, secondProduct }) => {
    const prompt = `
Eres un asesor de compra de una tienda online.

Compara estos dos productos usando únicamente los datos proporcionados.

Producto 1:
ID: ${firstProduct.id}
Nombre: ${firstProduct.name}
Categoría: ${firstProduct.category_name || 'Sin categoría'}
Precio: ${formatPrice(firstProduct.price)}
Stock: ${firstProduct.stock}
Descripción: ${firstProduct.description || 'Sin descripción'}

Producto 2:
ID: ${secondProduct.id}
Nombre: ${secondProduct.name}
Categoría: ${secondProduct.category_name || 'Sin categoría'}
Precio: ${formatPrice(secondProduct.price)}
Stock: ${secondProduct.stock}
Descripción: ${secondProduct.description || 'Sin descripción'}

Reglas:
- No inventes características.
- Explica diferencias de precio, uso recomendado y puntos fuertes.
- Termina con una recomendación final.
- Responde en español.
`

    const mockAnswer = `${firstProduct.name} cuesta ${formatPrice(firstProduct.price)} y ${secondProduct.name} cuesta ${formatPrice(secondProduct.price)}. La mejor elección dependerá de la necesidad principal del usuario y del presupuesto disponible.`

    return callProvider({ prompt, mockAnswer })
}