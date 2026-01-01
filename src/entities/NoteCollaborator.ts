import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './User';
import { Note } from './Note';

@Entity('note_collaborators')
@Unique(['userId', 'noteId'])
export class NoteCollaborator {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'note_id', type: 'int' })
  noteId!: number;

  @ManyToOne(() => User, (user) => user.collaborations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Note, (note) => note.collaborators, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  note!: Note;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
