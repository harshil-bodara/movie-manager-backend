import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import Users from './users.entity';

@Entity('movies')
class Movies {
        @PrimaryGeneratedColumn()
        id: number;

        @ManyToOne(() => Users, (users) => users.movies, {
                onDelete: 'CASCADE',
                nullable: false,
        })
        @JoinColumn({ name: 'userId' })
        user: number;

        @Column()
        title: string;

        @Column()
        publishedYear: string;

        @Column()
        poster: string;
}

export default Movies


