import { useState } from 'react'
import { getProductRecommendation } from '../services/aiService'

const initialMessages = [
    {
        role: 'assistant',
        content: 'Hola. Soy el asistente de la tienda. Dime qué necesitas y te recomendaré productos reales del catálogo.'
    }
]

export const AIRecommendationChat = () => {
    const [messages, setMessages] = useState(initialMessages)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        const userMessage = input.trim()

        if (!userMessage) return

        setMessages((currentMessages) => [
            ...currentMessages,
            { role: 'user', content: userMessage }
        ])
        setInput('')
        setLoading(true)
        setError('')

        try {
            const data = await getProductRecommendation(userMessage)

            setMessages((currentMessages) => [
                ...currentMessages,
                { role: 'assistant', content: data.answer }
            ])
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='ai-tool-card'>
            <header className='ai-tool-header'>
                <span className='ai-tool-kicker'>Herramienta 1</span>
                <h2>Chatbot recomendador</h2>
                <p>Escribe una necesidad y la IA recomendará productos reales de la tienda.</p>
            </header>

            <div className='ai-chat-messages'>
                {messages.map((message, index) => (
                    <div
                        className={`ai-chat-message ai-chat-message--${message.role}`}
                        key={`${message.role}-${index}`}
                    >
                        {message.content}
                    </div>
                ))}

                {loading && (
                    <div className='ai-chat-message ai-chat-message--assistant'>
                        Pensando recomendación...
                    </div>
                )}
            </div>

            {error && <p className='ai-error'>{error}</p>}

            <form className='ai-form ai-chat-form' onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder='Ej: necesito algo para teletrabajar'
                    disabled={loading}
                />

                <button type='submit' disabled={loading}>
                    Enviar
                </button>
            </form>
        </section>
    )
}