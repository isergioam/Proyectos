// ==========================================================================
// PROJECTS METADATA DATABASE
// ==========================================================================
const projects = [
    {
        id: "cacherunner",
        title: "Cache Runner",
        folder: "CacheRunner",
        category: "juegos",
        badge: "Juegos",
        icon: "fa-solid fa-gamepad",
        desc: "Juego de plataformas arcade sin fin en el que controlas a un procesador que esquiva fallos de caché (cache misses) y recolecta aciertos (hits).",
        longDesc: "Cache Runner es un juego arcade interactivo desarrollado con React y Vite en el frontend, y Express en el backend. Controlas a un procesador que recorre las celdas de memoria recolectando datos en caché mientras esquivas los bloqueos. Es un juego excelente para entender conceptos de arquitectura de computadores y sistemas de memoria de una manera lúdica y competitiva.",
        features: [
            "Marcador global en tiempo real que registra las mejores puntuaciones.",
            "Configuración de dificultad dinámica servida directamente desde el backend.",
            "Animaciones fluidas con Canvas y diseño responsivo móvil.",
            "Sistema de puntuación guardado de forma permanente en un archivo JSON local en el backend."
        ],
        tech: ["React 19", "Vite 8", "Express", "Node.js", "JSON Storage"],
        dbRequired: false,
        dbType: "Ninguno (Almacenamiento JSON Local)",
        dbFile: "",
        installCmd: "npm run install:cacherunner",
        runCmd: "npm run dev:cacherunner"
    },
    {
        id: "codeinvaders",
        title: "Code Invaders",
        folder: "CodeInvaders",
        category: "juegos",
        badge: "Juegos",
        icon: "fa-solid fa-jet-fighter-up",
        desc: "Clon del clásico Space Invaders con temática de desarrollo. Destruye bugs, warnings y errores de compilación antes de que rompan tu producción.",
        longDesc: "Code Invaders reimagina el clásico juego arcade con un toque de ingeniería de software. Manejas un cursor de código y disparas parches para solucionar Bugs, Warnings y Syntax Errors que caen del cielo de producción. Si alguno de ellos llega a la parte inferior de tu pantalla, tu código crasheará y perderás la partida.",
        features: [
            "Ranking competitivo de desarrolladores locales.",
            "Dificultad progresiva por oleadas de errores y warnings.",
            "Efectos visuales tipo matriz y animaciones fluidas.",
            "Configuración de juego editable en tiempo real (vidas, velocidad) a través del backend."
        ],
        tech: ["React 19", "Vite 8", "Express", "Node.js", "JSON Storage"],
        dbRequired: false,
        dbType: "Ninguno (Almacenamiento JSON Local)",
        dbFile: "",
        installCmd: "npm run install:codeinvaders",
        runCmd: "npm run dev:codeinvaders"
    },
    {
        id: "fitquest",
        title: "FitQuest",
        folder: "FitQuest",
        category: "productividad",
        badge: "Productividad",
        icon: "fa-solid fa-dumbbell",
        desc: "Gamifica tu entrenamiento diario. Completa ejercicios físicos reales para subir de nivel a tu avatar, ganar experiencia y competir en el ranking.",
        longDesc: "FitQuest convierte tu rutina diaria de ejercicios en una aventura de rol (RPG). Define tus propios desafíos de ejercicio (flexiones, correr, estiramientos), regístralos al completarlos y gana puntos de experiencia (XP) y monedas para desbloquear logros y competir en la tabla clasificatoria comunitaria.",
        features: [
            "Panel de retos personales personalizados y diarios.",
            "Registro de entrenamientos con fecha, tipo e historial de progreso.",
            "Cuentas de usuario con autenticación segura, cifrado bcrypt y tokens JWT.",
            "Base de datos relacional para guardar progresos de forma ordenada."
        ],
        tech: ["React", "Vite", "Node.js", "Express", "MySQL", "JWT", "Bcrypt"],
        dbRequired: true,
        dbType: "MySQL",
        dbFile: "FitQuest/backend/schema.sql",
        installCmd: "npm run install:fitquest",
        runCmd: "npm run dev:fitquest"
    },
    {
        id: "prestamos",
        title: "Préstamos",
        folder: "Prestamos",
        category: "finanzas",
        badge: "Finanzas",
        icon: "fa-solid fa-hand-holding-dollar",
        desc: "Calculadora y gestor de préstamos y deudas entre personas. Lleva el control de quién te debe dinero o a quién le debes, con amortizaciones.",
        longDesc: "Préstamos es una aplicación financiera intuitiva diseñada para llevar el control minucioso de transacciones crediticias entre amigos, familiares o pequeños clientes. Registra montos, calcula plazos de devolución, define intereses si aplica y marca pagos parciales o totales de forma interactiva.",
        features: [
            "Cálculo automático de intereses y saldos pendientes.",
            "Historial detallado de abonos y amortizaciones por cada préstamo.",
            "Filtros avanzados por estado de deuda (liquidado, pendiente, vencido).",
            "Panel de administración y estadísticas consolidadas de cobro."
        ],
        tech: ["React", "Vite", "Node.js", "Express", "MySQL", "Morgan"],
        dbRequired: true,
        dbType: "MySQL",
        dbFile: "Prestamos/backend/src/config/db.js",
        installCmd: "npm run install:prestamos",
        runCmd: "npm run dev:prestamos"
    },
    {
        id: "recetas",
        title: "Recetas",
        folder: "Recetas",
        category: "lifestyle",
        badge: "Lifestyle",
        icon: "fa-solid fa-utensils",
        desc: "Tu asistente personal de cocina. Guarda tus recetas favoritas, planifica menús semanales y crea listas de la compra inteligentes.",
        longDesc: "Recetas te permite digitalizar tu libro de cocina. Organiza tus preparaciones culinarias por categorías (postres, almuerzos, cenas), busca ingredientes de forma inteligente y planifica tus menús. Incluye una funcionalidad para generar automáticamente la lista de compras basada en los ingredientes de las recetas elegidas.",
        features: [
            "Creador de recetas interactivas con tiempos y pasos de preparación.",
            "Filtro de recetas por alérgenos o tipos de dieta (vegano, celíaco, etc.).",
            "Base de datos relacional MySQL para almacenamiento permanente de platos.",
            "Buscador predictivo por ingredientes disponibles en tu nevera."
        ],
        tech: ["React", "Vite", "Node.js", "Express", "MySQL"],
        dbRequired: true,
        dbType: "MySQL",
        dbFile: "Recetas/backend-recetas/src/database/connection.js",
        installCmd: "npm run install:recetas",
        runCmd: "npm run dev:recetas"
    },
    {
        id: "tienda",
        title: "Tienda Online",
        folder: "Tienda",
        category: "ecommerce",
        badge: "E-Commerce",
        icon: "fa-solid fa-bag-shopping",
        desc: "Plataforma de comercio electrónico con pasarela simulada, carrito de compras, catálogo dinámico y panel de administración completo.",
        longDesc: "Tienda es un simulador completo de e-commerce de extremo a extremo. Cuenta con una experiencia de cara al cliente (catálogo de productos, filtros por categoría, búsqueda rápida, gestión de carrito y checkout) y un panel administrativo avanzado que permite crear, editar y eliminar productos del inventario en tiempo real.",
        features: [
            "Carrito de compras interactivo con persistencia de sesión.",
            "Autenticación segura por roles (usuario estándar vs administrador).",
            "Panel de administración completo (CRUD de productos y categorías).",
            "Base de datos relacional gestionada con Prisma ORM."
        ],
        tech: ["React", "Vite", "Node.js", "Express", "MySQL", "Prisma ORM"],
        dbRequired: true,
        dbType: "MySQL",
        dbFile: "Tienda/backend-tienda/prisma/schema.prisma",
        installCmd: "npm run install:tienda",
        runCmd: "npm run dev:tienda"
    },
    {
        id: "documentos",
        title: "Documentos",
        folder: "Documentos",
        category: "productividad",
        badge: "Productividad",
        icon: "fa-solid fa-file-invoice",
        desc: "Gestor de documentos digitales y notas. Crea, edita y organiza textos con formato enriquecido en tu propio espacio de almacenamiento.",
        longDesc: "Documentos es una aplicación web pensada para la redacción y archivo de notas y archivos de texto importantes. Organiza tus escritos por categorías o carpetas personalizadas, edítalos usando un editor de texto enriquecido y compártelos mediante enlaces únicos o mantenlos privados bajo autenticación.",
        features: [
            "Editor de texto enriquecido (WYSIWYG) integrado en el navegador.",
            "Gestión de visibilidad (documentos públicos y privados).",
            "Búsqueda avanzada instantánea por contenido, títulos y etiquetas.",
            "Control de versiones básico para restaurar cambios anteriores."
        ],
        tech: ["React", "Vite", "Node.js", "Express", "MySQL"],
        dbRequired: true,
        dbType: "MySQL",
        dbFile: "Documentos/backend-documentos/src/database/connection.js",
        installCmd: "npm run install:documentos",
        runCmd: "npm run dev:documentos"
    }
];

// ==========================================================================
// DOM ELEMENTS REFERENCE
// ==========================================================================
const gridContainer = document.getElementById("projects-grid-container");
const searchInput = document.getElementById("search-input");
const filterTabs = document.querySelectorAll(".filter-tab");

// Modal Elements
const modal = document.getElementById("project-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalTitle = document.getElementById("modal-project-title");
const modalTag = document.getElementById("modal-project-tag");
const modalDesc = document.getElementById("modal-project-desc");
const modalFeatures = document.getElementById("modal-project-features");
const modalTech = document.getElementById("modal-project-tech");
const modalIcon = document.getElementById("modal-project-icon");

// Modal Tab Elements
const modalTabs = document.querySelectorAll(".modal-tab");
const modalBodyContents = document.querySelectorAll(".modal-body-content");

// Modal Setup Steps Code Blocks
const codeInstall = document.getElementById("code-install");
const codeRun = document.getElementById("code-run");
const codeDbFile = document.getElementById("code-db-file");
const stepDbSetup = document.getElementById("step-db-setup");
const stepRunNum = document.getElementById("step-run-num");
const dbAlert = document.getElementById("modal-db-alert");

// Current Filters State
let currentFilter = "all";
let currentSearch = "";

// ==========================================================================
// CARD RENDERING LOGIC
// ==========================================================================
function renderProjects() {
    gridContainer.innerHTML = "";
    
    const filteredProjects = projects.filter(project => {
        const matchesCategory = currentFilter === "all" || 
            (currentFilter === "juegos" && project.category === "juegos") ||
            (currentFilter === "productividad" && project.category === "productividad") ||
            (currentFilter === "db" && project.dbRequired);
            
        const matchesSearch = project.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
            project.desc.toLowerCase().includes(currentSearch.toLowerCase()) ||
            project.tech.some(t => t.toLowerCase().includes(currentSearch.toLowerCase()));
            
        return matchesCategory && matchesSearch;
    });

    if (filteredProjects.length === 0) {
        gridContainer.innerHTML = `
            <div class="no-results-box">
                <i class="fa-solid fa-face-frown no-results-icon"></i>
                <p>No se encontraron proyectos con esos criterios. ¡Prueba otra búsqueda o filtro!</p>
            </div>
        `;
        return;
    }

    filteredProjects.forEach(project => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.id = `card-${project.id}`;
        
        const badgeClass = `badge-${project.category}`;
        const dbBadge = project.dbRequired 
            ? `<span class="tech-tag" style="border-color: rgba(245, 158, 11, 0.3); color: #f59e0b;"><i class="fa-solid fa-database"></i> MySQL</span>`
            : `<span class="tech-tag" style="border-color: rgba(16, 185, 129, 0.3); color: #10b981;"><i class="fa-solid fa-server"></i> JSON Local</span>`;

        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon-area">
                    <i class="${project.icon}"></i>
                </div>
                <span class="badge ${badgeClass}">${project.badge}</span>
            </div>
            <h3 class="card-title">${project.title}</h3>
            <p class="card-desc">${project.desc}</p>
            <div class="card-tags">
                ${dbBadge}
                ${project.tech.slice(0, 3).map(t => `<span class="tech-tag">${t}</span>`).join("")}
            </div>
            <div class="card-actions">
                <button class="btn btn-primary btn-open-local" data-id="${project.id}" id="btn-run-${project.id}">
                    <i class="fa-solid fa-play"></i> Cómo Ejecutar
                </button>
                <a href="https://github.com/isergioam/Proyectos/tree/main/${project.folder}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" id="btn-code-${project.id}">
                    <i class="fa-solid fa-code"></i> Código
                </a>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });

    // Add modal click listeners to newly rendered cards
    document.querySelectorAll(".btn-open-local").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const pId = e.currentTarget.getAttribute("data-id");
            openModal(pId);
        });
    });
}

// ==========================================================================
// SEARCH & FILTER HANDLERS
// ==========================================================================
searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderProjects();
});

filterTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
        filterTabs.forEach(t => {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
        });
        e.currentTarget.classList.add("active");
        e.currentTarget.setAttribute("aria-selected", "true");
        currentFilter = e.currentTarget.getAttribute("data-filter");
        renderProjects();
    });
});

// ==========================================================================
// MODAL DIALOG MANAGEMENT
// ==========================================================================
function openModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Reset back to Info Tab on open
    switchTab("content-info");

    // Populate data
    modalTitle.textContent = project.title;
    modalTag.textContent = project.badge;
    modalTag.className = `badge badge-${project.category}`;
    modalDesc.textContent = project.longDesc;
    
    // Set Header Icon
    modalIcon.innerHTML = `<i class="${project.icon}"></i>`;
    
    // Features list
    modalFeatures.innerHTML = project.features.map(f => `<li>${f}</li>`).join("");
    
    // Tech tags
    modalTech.innerHTML = project.tech.map(t => `<span>${t}</span>`).join("");

    // Setup Code blocks
    codeInstall.textContent = project.installCmd;
    codeRun.textContent = project.runCmd;

    // Adjust Steps depending on DB requirement
    if (project.dbRequired) {
        dbAlert.style.display = "flex";
        stepDbSetup.style.display = "flex";
        stepRunNum.textContent = "4";
        codeDbFile.textContent = `# Archivo esquema base:\n/${project.dbFile}`;
    } else {
        dbAlert.style.display = "none";
        stepDbSetup.style.display = "none";
        stepRunNum.textContent = "3";
    }

    // Show Modal
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Disable scroll behind
}

function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Re-enable scroll
}

modalCloseBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape Key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
    }
});

// ==========================================================================
// MODAL TABS SWITCHING LOGIC
// ==========================================================================
function switchTab(tabContentId) {
    modalTabs.forEach(tab => {
        if (tab.getAttribute("data-tab") === tabContentId) {
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
        } else {
            tab.classList.remove("active");
            tab.setAttribute("aria-selected", "false");
        }
    });

    modalBodyContents.forEach(content => {
        if (content.id === tabContentId) {
            content.classList.add("active");
        } else {
            content.classList.remove("active");
        }
    });
}

modalTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
        const tabContentId = e.currentTarget.getAttribute("data-tab");
        switchTab(tabContentId);
    });
});

// ==========================================================================
// COPY TO CLIPBOARD HANDLER
// ==========================================================================
document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const targetId = e.currentTarget.getAttribute("data-copy-target");
        const codeElement = document.getElementById(targetId);
        if (!codeElement) return;

        let textToCopy = codeElement.textContent;
        // Clean comments/helpers in copy
        if (textToCopy.startsWith("#")) {
            textToCopy = textToCopy.split("\n")[1] || textToCopy;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            // Visual feedback
            const icon = e.currentTarget.querySelector("i");
            icon.className = "fa-solid fa-check";
            icon.style.color = "var(--success)";
            
            setTimeout(() => {
                icon.className = "fa-regular fa-copy";
                icon.style.color = "";
            }, 2000);
        }).catch(err => {
            console.error("No se pudo copiar el texto: ", err);
        });
    });
});

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    renderProjects();
});
