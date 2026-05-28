import { useEffect, useState } from "react";
import "./styles.css";
import RecipesList from "./pages/RecipesList.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import RecipeCreate from "./pages/RecipeCreate.jsx";

export default function App() {
  const [route, setRoute] = useState({ name: "list", id: null });

  // navegación por hash: #/list, #/create, #/recipe/12
  useEffect(() => {
    function sync() {
      const h = window.location.hash || "#/list";
      const parts = h.replace("#/", "").split("/");
      if (parts[0] === "create") setRoute({ name: "create", id: null });
      else if (parts[0] === "recipe" && parts[1]) setRoute({ name: "detail", id: parts[1] });
      else setRoute({ name: "list", id: null });
    }
    window.addEventListener("hashchange", sync);
    sync();
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <div className="container">
      <header className="topbar">
        <div>
          <h1>🍲 Recetas colaborativas</h1>
          <p className="sub">CRUD con hambre, N–M con cariño y ⭐ sin drama.</p>
        </div>
        <nav className="nav">
          <a href="#/list">Listado</a>
          <a href="#/create">Crear receta</a>
        </nav>
      </header>

      {route.name === "list" && <RecipesList />}
      {route.name === "create" && <RecipeCreate />}
      {route.name === "detail" && <RecipeDetail id={route.id} />}
    </div>
  );
}


