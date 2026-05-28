import { requireString } from "../validations/validators.js";
import { listIngredients, createIngredientIfNotExists } from "../services/ingredients.service.js";

export async function getIngredients(req, res, next) {
    try {
        const q = (req.query.q || "").toString();
        const limit = Number(req.query.limit || 50);
        const data = await listIngredients({ q, limit });
        res.json({ data });
    } catch (err) {
        next(err);
    }
}

export async function postIngredient(req, res, next) {
    try {
        const nombre = requireString(req.body.nombre, "nombre", 120);
        const id = await createIngredientIfNotExists(nombre);
        res.status(201).json({ id, nombre });
    } catch (err) {
        next(err);
    }
}


