import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Inicialización
const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middlewares

const allowedOrigins = [
  'https://admin.sebastiangonzalez.co', // Origen de producción
  'http://localhost:5173'             // Origen de desarrollo de Vue
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Permite peticiones sin 'origin' (como las de Postman/Thunder Client)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'La política de CORS para este sitio no permite acceso desde el origen especificado.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// const corsOptions = {
//   origin: 'https://admin.sebastiangonzalez.co', // Futuro frontend

//   optionsSuccessStatus: 200 // Para navegadores antiguos
// };
// app.use(cors(corsOptions));  // Permite peticiones del frontend
app.use(express.json()); // Permite a Express entender JSON

// Middleware para autenticar el Token JWT
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // No hay token

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403); // Token no válido
        req.user = user;
        next();
    });
};

// --- RUTAS PÚBLICAS ---

// Ruta para el Login del Admin
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
});

// --- RUTAS PROTEGIDAS ---

// Obtener todos los contactos con filtros
app.get('/api/contacts', authenticateToken, async (req, res) => {
    const { status, interest, search } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (interest) where.interestLevel = parseInt(interest as string);
    if (search) {
        where.OR = [
            { companyName: { contains: search as string, mode: 'insensitive' } },
            { contactName: { contains: search as string, mode: 'insensitive' } },
            { email: { contains: search as string, mode: 'insensitive' } },
        ];
    }
    
    const contacts = await prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });
    res.json(contacts);
});

// Crear un nuevo contacto
app.post('/api/contacts', authenticateToken, async (req, res) => {
    const newContact = await prisma.contact.create({
        data: req.body,
    });
    // Log de la creación
    await prisma.activityLog.create({
        data: {
            contactId: newContact.id,
            eventDescription: `Contacto '${newContact.companyName}' creado.`
        }
    });
    res.status(201).json(newContact);
});

// Actualizar un contacto
app.put('/api/contacts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    
    // Obtenemos el estado anterior antes de actualizar
    const oldContact = await prisma.contact.findUnique({ where: { id }});
    if (!oldContact) return res.status(404).json({ error: 'Contacto no encontrado' });

    const updatedContact = await prisma.contact.update({
        where: { id },
        data: req.body,
    });

    // Si el estado ha cambiado, creamos un log
    if (oldContact.status !== updatedContact.status) {
        await prisma.activityLog.create({
            data: {
                contactId: updatedContact.id,
                eventDescription: `Estado cambiado de ${oldContact.status} a ${updatedContact.status}.`
            }
        });
    }

    res.json(updatedContact);
});

// Borrar un contacto
// app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
//     const { id } = req.params;
    
//     try {
//         await prisma.contact.delete({
//             where: { id },
//         });
//         // Usamos 204 No Content, un estándar para borrados exitosos sin respuesta.
//         res.status(204).send();
//     } catch (error) {
//         // Maneja el caso en que el contacto no se encuentre
//         res.status(404).json({ error: 'Contacto no encontrado' });
//     }
// });
app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    // --- LOGGING DE DIAGNÓSTICO ---
    console.log(`[DELETE] Petición recibida para borrar el contacto con ID: ${id}`);
    console.log(`[DELETE] Tipo de dato del ID recibido: ${typeof id}`);

    try {
        // Log para ver el objeto que pasamos a Prisma
        console.log(`[DELETE] Intentando ejecutar prisma.contact.delete con: { where: { id: "${id}" } }`);

        await prisma.contact.delete({
            where: { id },
        });

        console.log(`[DELETE] Contacto con ID: ${id} borrado exitosamente.`);
        res.status(204).send();
    } catch (errors: any) {
        // Log para ver el error exacto que Prisma devuelve
        console.error(`[DELETE] Prisma ha devuelto un error:`, errors);
        
        // El error de Prisma P2025 "Record to delete not found." es el que esperamos si no lo encuentra.
        if (errors.code === 'P2025') {
            console.error(`[DELETE] Causa probable: El ID "${id}" no existe en la base de datos.`);
            return res.status(404).json({ error: 'Contacto no encontrado en la base de datos.' });
        }

        // Para cualquier otro error
        res.status(500).json({ error: 'Error interno del servidor al intentar borrar el contacto.' });
    }
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});