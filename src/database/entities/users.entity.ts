import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Movies from './movies.entity';

@Entity()
class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Movies, (movies) => movies.user)
  movies: Movies[];

}

export default Users


