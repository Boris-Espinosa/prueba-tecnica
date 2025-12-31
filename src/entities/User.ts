import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Note } from "./Note";
import { NoteCollaborator } from "./NoteCollaborator";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: "varchar" })
  email!: string;

  @Column({ type: "text" })
  password!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @OneToMany(() => Note, (note) => note.owner)
  notes!: Note[];

  @OneToMany(() => NoteCollaborator, (collaborator) => collaborator.user)
  collaborations!: NoteCollaborator[];
}
