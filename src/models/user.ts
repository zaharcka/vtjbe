import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from "typeorm";
import bcrypt from "bcrypt";
import { ManyToOne } from "typeorm";

@Entity("users") // Явно указываем имя таблицы
export class User {
    @PrimaryGeneratedColumn("uuid") // Явно указываем стратегию генерации ID
    id!: string; // Используем non-null assertion

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({ type: "int", default: 0 })
    balance!: number;

    @Column({ type: "varchar", length: 50, default: "user" })
    role!: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions!: Transaction[];

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}



@Entity("transactions") // Явное указание имени таблицы
export class Transaction {
    @PrimaryGeneratedColumn("uuid") // UUID в качестве первичного ключа
    id!: string;

    @ManyToOne(() => User, (user) => user.transactions)
    user!: User;

    @Column({ type: "numeric", precision: 10, scale: 2 }) // Для денежных значений
    amount!: number;

    @Column({ type: "varchar", length: 20 })
    type!: "debit" | "credit";

    @Column({ type: "varchar", length: 255, nullable: true })
    description?: string;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdAt!: Date;
}
