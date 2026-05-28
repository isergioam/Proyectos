const API = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || "Error de red");
    }
    return data;
}

export const api = {
    health: () => request("/health"),

    listRecipes: (params) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/recipes?${qs}`);
    },

    getRecipe: (id) => request(`/recipes/${id}`),

    createRecipe: (payload) =>
        request("/recipes", { method: "POST", body: JSON.stringify(payload) }),

    addComment: (id, payload) =>
        request(`/recipes/${id}/comments`, { method: "POST", body: JSON.stringify(payload) }),

    rateRecipe: (id, payload) =>
        request(`/recipes/${id}/ratings`, { method: "POST", body: JSON.stringify(payload) }),

    listIngredients: (q = "") => request(`/ingredients?q=${encodeURIComponent(q)}&limit=50`),
};


