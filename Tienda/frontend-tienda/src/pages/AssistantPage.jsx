import { AIBudgetAdvisor } from '../components/AIBudgetAdvisor'
import { AIProductComparator } from '../components/AIProductComparator'
import { AIProductDescriptionGenerator } from '../components/AIProductDescriptionGenerator'
import { AIRecommendationChat } from '../components/AIRecommendationChat'
import { useAuth } from '../context/AuthContext'

export const AssistantPage = () => {
    const { isAdmin } = useAuth()

    return (
        <main className='page'>
            <div className='container'>
                <header className='page-header'>
                    <span className='page-kicker'>IA aplicada a tienda online</span>
                    <h1 className='page-title'>Asistente inteligente de compra</h1>
                    <p className='page-subtitle'>
                        En esta página reunimos varias utilidades de IA conectadas con el catálogo real de la tienda.
                    </p>
                </header>

                <section className='ai-tools-layout'>
                    <AIRecommendationChat />
                    <AIBudgetAdvisor />
                    <AIProductComparator />
                    {isAdmin && <AIProductDescriptionGenerator />}
                </section>
            </div>
        </main>
    )
}