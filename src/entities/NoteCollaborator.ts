/*----- libraries imports -----*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity('note_collaborators')
@Unique(['userId', 'noteId'])
export class NoteCollaborator {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'note_id', type: 'int' })
  noteId!: number;

  @ManyToOne('User', 'collaborations', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: any;

  @ManyToOne('Note', 'collaborators', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  note!: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
