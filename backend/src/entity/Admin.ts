import { Entity, Column, PrimaryColumn } from "typeorm";
@Entity()
export class Admin {

  @PrimaryColumn({ type: "nvarchar", charset: "utf8mb4" })
  AdminName: string;

  @Column({ type: "nvarchar", charset: "utf8mb4" })
  Contact: string;

  @Column({ type: "nvarchar", charset: "utf8mb4" })
  PwdHash: string;

  @Column({ type: "nvarchar", charset: "utf8mb4" })
  PwdSalt: string;

}
