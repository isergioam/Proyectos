import express from "express";
import cors from "cors";

import recipesRoutes from "./routes/recipes.routes.js";
import ingredientsRoutes from "./routes/ingredients.routes.js";
import { httpError } from "./validations/httpError.js";

export function createApp() {
    const app = express();

    // JSON body
    app.use(express.json());

    // CORS para frontend
    app.use(cors({ origin: true }));

    // Healthcheck
    app.get("/api/health", (req, res) => {
        res.json({ ok: true, message: "API Recetas funcionando" });
    });

    // Routes
    app.use("/api/recipes", recipesRoutes);
    app.use("/api/ingredients", ingredientsRoutes);

    // 404
    app.use((req, res) => {
        res.status(404).json({ error: "Not Found" });
    });

    // Error handler
    app.use((err, req, res, next) => {
        const status = err.status || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ error: message });
    });

    return app;
}

