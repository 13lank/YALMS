import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User'
import { Book } from './Book'

@Entity()
export class Record {

  @PrimaryGeneratedColumn()
  RID: number;

  @Column("date")
  LentDate: string;

  @Column("date")
  ReturnDate: string;

  @Column("boolean")
  Returned: boolean;

  @ManyToOne(type => User, User => User.Records)
  User: User;

  @ManyToOne(type => Book, Book => Book.Records)
  Book: Book;

}