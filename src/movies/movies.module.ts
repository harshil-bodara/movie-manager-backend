import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import MovieService from './movies.service';
import Movies from 'src/database/entities/movies.entity';
import Users from 'src/database/entities/users.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Users, Movies])],
  controllers: [MoviesController],
  providers: [MovieService],
})
export class MoviesModule { }