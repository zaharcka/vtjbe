// src/scripts/initDB.ts
import mongoose from 'mongoose';
import { User } from '../models/user';
import { Transaction } from '../models/transaction';
import bcrypt from 'bcrypt';

async function initDatabase() {
    // Создаем администратора
    const adminEmail = 'admin@example.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            email: adminEmail,
            password: hashedPassword,
            balance: 1000,
            role: 'admin'
        });
        console.log('Admin user created');
    }

    // Создаем индексы
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Transaction.collection.createIndex({ userId: 1 });
    await Transaction.collection.createIndex({ createdAt: -1 });
}

// Запуск после подключения к БД
mongoose.connection.once('open', initDatabase);
