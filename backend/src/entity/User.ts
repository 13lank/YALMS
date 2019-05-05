import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Record } from "./Record"
@Entity()
export class User {

    @PrimaryColumn({ type: "char", length: 10 })
    CardId: string;

    @Column({ type: "nvarchar", charset: "utf8mb4" })
    Name: string;

    @Column({ type: "nvarchar", charset: "utf8mb4" })
    Dept: string;

    @Column({ type: "nvarchar", charset: "utf8mb4" })
    PwdHash: string;

    @Column({ type: "nvarchar", charset: "utf8mb4" })
    PwdSalt: string;

    @OneToMany(type => Record, Record => Record.User, { cascade: true })
    Records: Record[];

}