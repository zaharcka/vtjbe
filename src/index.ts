require('dotenv').config(); // Добавьте ЭТУ строку ПЕРВОЙ в вашем
import "reflect-metadata";
import { AppDataSource } from "./config/ormconfig";
import express, { Request, Response, NextFunction, Application, RequestHandler } from "express";
import { User } from "./models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import {AuthenticatedRequest, authenticateJWT} from "./middleware/auth";
import multer from 'multer';
import {randomUUID} from "node:crypto";
import path from "path";
import {extractAudioToMonoMp3} from "./services/audioEncoder";


const storage = multer.diskStorage({
    destination: 'uploads/', // папка для сохранения
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const timestamp = new Date().toISOString()
            .replace(/[:.]/g, '-'); // заменяем недопустимые символы
        const userName = req.user?.email;
        const filename = `${userName ? userName + "_" : ""}${timestamp}${ext}`;
        cb(null, filename);
    }
});


const upload = multer({storage})
const app: Application = express();

app.use(express.json());
app.use(cors())

// 1. Интерфейсы для типизации запросов
interface RegisterRequest {
    email: string;
    password: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

const registerHandler = async (
req: Request<{}, {}, RegisterRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User)
        const existingUser = await userRepository.findOne({ where: { email } });

        if (existingUser) {
            res.status(400).json({ error: "Email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            email,
            password: hashedPassword,
            balance: 0,
            role: "user"
        });

        await userRepository.save(user);

        res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
        next(error);
    }
};

// 3. Обработчик входа
const loginHandler = async (
    req: Request<{}, {}, LoginRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        next(error);
    }
};


app.get('/me', authenticateJWT, (req, res) => {
    const user = req.user as User | undefined;

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // Не возвращаем пароль в ответе
    const { password, ...userData } = user;

    res.json({
        user: userData
    });
});

// 4. Подключение маршрутов
app.post("/register", registerHandler);
app.post("/login", loginHandler);

// 5. Обработчик ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});


app.post(
    '/uploadVideo',
    authenticateJWT,
    upload.single('video'),


    async (req, res): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No video file provided' });
                return;

            }

            const orderId = randomUUID();
            res.status(202).json({ orderId });

            const videoPath = req.file.path;

            const audioFile = await extractAudioToMonoMp3(videoPath, 'audio')



        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: errorMessage });
        }
    }
);


// 5. Инициализация
AppDataSource.initialize()
    .then(() => {
        console.log("Подключены к БД.");
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
