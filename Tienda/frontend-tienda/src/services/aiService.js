import { apiRequest } from '../api/apiClient'

export const getProductRecommendation = (message) => {
    return apiRequest('/ai/recommendations', {
        method: 'POST',
        body: { message }
    })
}

export const getBudgetAdvice = ({ message, budget }) => {
    return apiRequest('/ai/budget-advisor', {
        method: 'POST',
        body: { message, budget }
    })
}

export const compareProductsWithAI = ({ firstProductId, secondProductId }) => {
    return apiRequest('/ai/compare-products', {
        method: 'POST',
        body: { firstProductId, secondProductId }
    })
}

export const generateProductDescriptionWithAI = ({ name, category, features }) => {
    return apiRequest('/ai/product-description', {
        method: 'POST',
        body: { name, category, features }
    })
}

export const getProductsForAISelector = () => {
    return apiRequest('/products?limit=100')
}