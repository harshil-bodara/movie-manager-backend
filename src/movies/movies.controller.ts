import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import UsersEntity from 'src/database/entities/users.entity';
import { Users } from 'src/utils/common/user.decorator';
import MovieService from './movies.service';
import { MovieDto } from './movies.dto';


@Controller('movie')
export class MoviesController {
        constructor(private readonly moviesService: MovieService) { }

        @Get('/getAll')
        @UseGuards(AuthGuard('jwt'))
        async getUserInfo(@Users() users: Partial<UsersEntity> , @Query('page') page: number) {
                return await this.moviesService.getMovies(users.id , page);
        }


        @Post('/')
        @UseGuards(AuthGuard('jwt'))
        async addMovie(@Users() users: Partial<UsersEntity>, @Body() movieDto:MovieDto ) {
                console.log("users", users)
                return await this.moviesService.addMovie(users.id, movieDto);
        }

        @Get('/')
        @UseGuards(AuthGuard('jwt'))
        async getMovieById(@Users() users: Partial<UsersEntity>, @Query('id') movieId: number) {
                return await this.moviesService.getMovieById(users.id, movieId);
        }

        @Put('/')
        @UseGuards(AuthGuard('jwt'))
        async updateMovie(@Users() users: Partial<UsersEntity>, @Body() movieData) {
                return await this.moviesService.updateMovie(users.id, movieData);
        }

        @Delete('/')
        @UseGuards(AuthGuard('jwt'))
        async deleteMovie(@Users() users: Partial<UsersEntity>, @Query('id') movieId: number) {
                return await this.moviesService.deleteMovie(users.id, movieId);
        }
}