import { useEffect, useState } from "react";
import "./ParallaxHero.css";

export default function ParallaxHero() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Parallax translation factors
    const bgTransform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
    const textTransform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
    
    // Floating food icons rotating and moving at different speeds
    const floatTomato = `translate3d(0, ${scrollY * -0.25}px, 0) rotate(${scrollY * 0.08}deg)`;
    const floatBasil = `translate3d(0, ${scrollY * 0.18}px, 0) rotate(${scrollY * -0.06}deg)`;
    const floatGarlic = `translate3d(0, ${scrollY * -0.15}px, 0) rotate(${scrollY * 0.04}deg)`;
    const floatCheese = `translate3d(0, ${scrollY * 0.22}px, 0) rotate(${scrollY * -0.08}deg)`;
    const floatAvocado = `translate3d(0, ${scrollY * -0.3}px, 0) rotate(${scrollY * 0.12}deg)`;

    const scrollToRecipes = (e) => {
        e.preventDefault();
        const element = document.getElementById("list-section");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="parallax-hero">
            <div 
                className="parallax-hero-bg" 
                style={{ 
                    transform: bgTransform,
                    backgroundImage: `url("https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1600&auto=format&fit=crop&q=80")` 
                }}
            />
            <div className="parallax-hero-overlay" />
            
            {/* Layered Floating Ingredients for Parallax Depth */}
            <div className="parallax-float item-tomato" style={{ transform: floatTomato }}>🍅</div>
            <div className="parallax-float item-basil" style={{ transform: floatBasil }}>🌿</div>
            <div className="parallax-float item-garlic" style={{ transform: floatGarlic }}>🧄</div>
            <div className="parallax-float item-cheese" style={{ transform: floatCheese }}>🧀</div>
            <div className="parallax-float item-avocado" style={{ transform: floatAvocado }}>🥑</div>

            <div className="parallax-hero-content" style={{ transform: textTransform }}>
                <span className="parallax-hero-badge">Comunidad Gastronómica</span>
                <h2 className="parallax-hero-title">El Arte de Compartir el Sabor</h2>
                <p className="parallax-hero-subtitle">
                    Explora cientos de recetas gourmet compartidas por amantes de la cocina, califica tus favoritas y publica tus propias creaciones.
                </p>
                <div className="parallax-hero-actions">
                    <a href="#/create" className="btn-parallax-primary">
                        ✨ Compartir Receta
                    </a>
                    <a href="#list-section" onClick={scrollToRecipes} className="btn-parallax-secondary">
                        🔍 Explorar Listado
                    </a>
                </div>
            </div>
        </div>
    );
}
