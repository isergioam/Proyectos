const mysql = require('mysql2/promise');

const host = 'mysql-proyectos-hub-proyectos-hub.l.aivencloud.com';
const port = 21705;
const user = 'avnadmin';

const password = process.argv[2];

if (!password) {
    console.error('Error: Debes proporcionar la contraseña de Aiven MySQL como argumento.');
    console.error('Uso: node seed-demo-data.js <CONTRASEÑA>');
    process.exit(1);
}

const ssl = { rejectUnauthorized: false };

async function seedTienda(connection) {
    console.log('\n--- Sembrando Tienda ---');
    
    // 1. Limpiar datos viejos
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE products');
    await connection.query('TRUNCATE TABLE categories');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 2. Insertar Categorías
    const [catResult1] = await connection.query('INSERT INTO categories (name) VALUES (?)', ['Tecnología']);
    const [catResult2] = await connection.query('INSERT INTO categories (name) VALUES (?)', ['Ropa Deportiva']);
    const [catResult3] = await connection.query('INSERT INTO categories (name) VALUES (?)', ['Hogar']);

    const catIdTech = catResult1.insertId;
    const catIdSports = catResult2.insertId;
    const catIdHome = catResult3.insertId;

    // 3. Insertar Productos
    const products = [
        ['Auriculares Inalámbricos Pro', 'Auriculares de diadema con cancelación activa de ruido y 40h de batería.', 79.99, 15, catIdTech],
        ['Teclado Mecánico RGB', 'Teclado compacto 60% con switches mecánicos táctiles y retroiluminación configurable.', 59.99, 8, catIdTech],
        ['Soporte de Aluminio para Portátil', 'Diseño ergonómico ajustable y plegable para mejorar tu postura al programar.', 19.99, 25, catIdTech],
        ['Camiseta Running Dry-Fit', 'Tejido transpirable de secado rápido ideal para entrenamientos de alta intensidad.', 24.99, 30, catIdSports],
        ['Pantalones Cortos Deportivos', 'Pantalón con forro interior y bolsillos con cremallera para guardar tus llaves.', 18.50, 20, catIdSports],
        ['Lámpara de Escritorio LED', 'Brazo flexible con brillo táctil regulable y puerto de carga USB incorporado.', 34.99, 12, catIdHome]
    ];

    for (const p of products) {
        await connection.query(
            'INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)',
            p
        );
        console.log(`  [Producto]: ${p[0]} añadido.`);
    }
    console.log('✅ Tienda sembrada con éxito.');
}

async function seedFitQuest(connection) {
    console.log('\n--- Sembrando FitQuest ---');
    
    // 1. Limpiar retos viejos
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE challenges');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 2. Insertar retos
    const challenges = [
        ['Rutina Calistenia Principiante', 'Iníciate en el entrenamiento con peso corporal realizando flexiones, sentadillas y fondos diariamente.', 14, 'facil'],
        ['Desafío Cardio 30 Días', 'Completa sesiones de carrera continua de al menos 30 minutos para mejorar tu resistencia cardiovascular.', 30, 'intermedio'],
        ['Flexibilidad y Movilidad Total', 'Rutina de estiramientos profundos de 15 minutos centrados en caderas, espalda y hombros.', 7, 'facil'],
        ['Fuerza Absoluta (Pesas)', 'Desafío de levantamiento enfocado en ejercicios compuestos como peso muerto, press de banca y sentadillas.', 21, 'dificil']
    ];

    for (const c of challenges) {
        await connection.query(
            'INSERT INTO challenges (title, description, duration_days, difficulty) VALUES (?, ?, ?, ?)',
            c
        );
        console.log(`  [Reto]: ${c[0]} añadido.`);
    }
    console.log('✅ FitQuest sembrado con éxito.');
}

async function seedRecetas(connection) {
    console.log('\n--- Sembrando Recetas ---');
    
    // 1. Limpiar recetas
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE receta_ingredientes');
    await connection.query('TRUNCATE TABLE recetas');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 2. Buscar usuario autor de prueba
    const [users] = await connection.query('SELECT id FROM usuarios LIMIT 1');
    if (users.length === 0) {
        console.log('  Advertencia: No se encontró ningún usuario. Creando un usuario de prueba...');
        const [userResult] = await connection.query('INSERT INTO usuarios (nombre, email) VALUES ("Chef Demo", "demo@recetas.com")');
        users.push({ id: userResult.insertId });
    }
    const autorId = users[0].id;

    // 3. Crear Recetas
    const recipes = [
        {
            titulo: 'Pasta al Pomodoro Clásica',
            descripcion: 'Auténtica receta italiana de pasta con una deliciosa salsa de tomates frescos cocinados a fuego lento con albahaca.',
            pasos: '1. Cocer la pasta en abundante agua con sal.\n2. En una sartén, sofreír el ajo picado en aceite de oliva.\n3. Añadir los tomates triturados y una pizca de sal. Dejar cocinar 15 minutos.\n4. Escurrir la pasta e incorporarla a la sartén.\n5. Servir caliente adornado con hojas de albahaca fresca y pimienta al gusto.',
            tiempo_min: 20,
            dificultad: 'facil',
            porciones: 2,
            ingredientes: ['Pasta', 'Tomate', 'Ajo', 'Aceite de oliva', 'Sal']
        },
        {
            titulo: 'Pan de Ajo Rústico Crujiente',
            descripcion: 'Un acompañamiento clásico, dorado por fuera y suave por dentro, con un aroma a ajo y perejil irresistible.',
            pasos: '1. Precalentar el horno a 180°C.\n2. Picar finamente el ajo y mezclarlo en un bol con mantequilla blanda y perejil picado.\n3. Cortar el pan en rebanadas gruesas sin llegar a separarlas del todo.\n4. Untar la mezcla de ajo generosamente entre los cortes del pan.\n5. Envolver el pan en papel de aluminio y hornear durante 10 minutos. Luego, abrir el papel y hornear 5 minutos más hasta que quede crujiente.',
            tiempo_min: 15,
            dificultad: 'facil',
            porciones: 4,
            ingredientes: ['Ajo', 'Sal']
        }
    ];

    for (const r of recipes) {
        const [recResult] = await connection.query(
            'INSERT INTO recetas (autor_id, titulo, descripcion, pasos, tiempo_min, dificultad, porciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [autorId, r.titulo, r.descripcion, r.pasos, r.tiempo_min, r.dificultad, r.porciones]
        );
        const recetaId = recResult.insertId;
        console.log(`  [Receta]: ${r.titulo} añadida.`);

        // Relacionar ingredientes
        for (const ingNombre of r.ingredientes) {
            const [ingRows] = await connection.query('SELECT id FROM ingredientes WHERE nombre = ?', [ingNombre]);
            if (ingRows.length > 0) {
                const ingredienteId = ingRows[0].id;
                await connection.query(
                    'INSERT INTO receta_ingredientes (receta_id, ingrediente_id, cantidad, unidad) VALUES (?, ?, 1, "unidad")',
                    [recetaId, ingredienteId]
                );
            }
        }
    }
    console.log('✅ Recetas sembradas con éxito.');
}

async function run() {
    console.log('Conectando a Aiven MySQL para sembrar datos...');

    try {
        // 1. Tienda
        const connTienda = await mysql.createConnection({ host, port, user, password, database: 'tienda', ssl });
        await seedTienda(connTienda);
        await connTienda.end();

        // 2. FitQuest
        const connFit = await mysql.createConnection({ host, port, user, password, database: 'fitquest', ssl });
        await seedFitQuest(connFit);
        await connFit.end();

        // 3. Recetas
        const connRecetas = await mysql.createConnection({ host, port, user, password, database: 'recetas_db', ssl });
        await seedRecetas(connRecetas);
        await connRecetas.end();

        console.log('\n🎉 ¡Sembrado de datos finalizado con éxito! Todos los proyectos cuentan ahora con datos iniciales.');
    } catch (error) {
        console.error('❌ Error general durante el sembrado:', error.message);
    }
}

run();
