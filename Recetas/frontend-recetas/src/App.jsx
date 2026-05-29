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
        <div className="brand">
          <span className="brand-logo">🍲</span>
          <div>
            <h1>GustoShare</h1>
            <p className="sub">La red social gourmet para compartir y descubrir recetas en comunidad.</p>
          </div>
        </div>
        <nav className="nav">
          <a href="#/list" className={route.name === "list" || route.name === "detail" ? "active" : ""}>Explorar recetas</a>
          <a href="#/create" className={route.name === "create" ? "active" : "btn-create"}>+ Compartir Receta</a>
        </nav>
      </header>

      {route.name === "list" && <RecipesList />}
      {route.name === "create" && <RecipeCreate />}
      {route.name === "detail" && <RecipeDetail id={route.id} />}
    </div>
  );
}


