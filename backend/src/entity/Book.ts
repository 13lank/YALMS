import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Record } from "./Record";

@Entity()
export class Book {

  @PrimaryColumn({ type: "char", length: 13 })//using ISBN-13, e.g. "9780136019701"
  BookNo: string;

  @Column({ type: "nvarchar", charset: "utf8mb4" })
  BookName: string;

  @Column({ type: "nvarchar", charset: "utf8mb4" })
  BookType: string;

  @Column({ type: "nvarchar", charset: "utf8mb4" })
  Author: string;

  @Column({ type: "nvarchar", charset: "utf8mb4" })
  Publisher: string;

  @CreateDateColumn()
  CreateDate: string;

  @Column("float")
  Price: number;

  @Column("int")
  Storage: number;

  @Column("int")
  Total: number;

  @OneToMany(type => Record, Record => Record.Book, { cascade: true })
  Records: Record[];

}