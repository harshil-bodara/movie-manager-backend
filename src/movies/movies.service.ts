import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { APIResponse } from 'src/utils/common/apiResponse';
import MoviesEntity from 'src/database/entities/movies.entity';
import { MovieDto } from './movies.dto';




class MovieService {
  constructor(
    @InjectRepository(MoviesEntity)
    private movieRepository: Repository<MoviesEntity>) {

  }

  async getMovies(userId: number, page: number) {
    try {
      const limit = 8; // items per page
      const skip = (page - 1) * limit; // items to skip

      const [movies, total] = await this.movieRepository.createQueryBuilder('movie')
        .select(['movie.id', 'movie.title', 'movie.publishedYear', 'movie.poster'])
        .leftJoin('movie.user', 'user') 
        .where('user.id = :userId', { userId })
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return APIResponse.success({ movies, total });
    } catch (error) {
      // Return an internal server error response
      return APIResponse.internalServerError();
    }
  }

  async addMovie(userId: number, movieData: MovieDto) {
    try {
      const movie = new MoviesEntity();
      movie.user = userId;
      movie.title = movieData.title;
      movie.publishedYear = movieData.publishedYear;
      movie.poster = movieData.poster;
      await this.movieRepository.save(movie);
      return APIResponse.success(movie);
    } catch (error) {
      console.log(error);
      return APIResponse.internalServerError();
    }
  }


  async getMovieById(userId: number, movieId: number) {
    try {

      const movie = await this.movieRepository.createQueryBuilder('movie')
        .select(['movie.id', 'movie.title', 'movie.publishedYear', 'movie.poster'])
        .leftJoin('movie.user', 'user')
        .where('user.id = :userId', { userId })
        .andWhere('movie.id = :movieId', { movieId })
        .getOne();

      if (!movie) {
        return APIResponse.notFound();
      }

      return APIResponse.success(movie);
    } catch (error) {
      // Return an internal server error response
      return APIResponse.internalServerError();
    }
  }


  async updateMovie(userId: number, movieData) {
    try {
      if (!movieData.id) {
        return APIResponse.conflict('Please provide movie id');
      }

      const {affected } = await this.movieRepository.update({ id: movieData.id, user: userId }, movieData);
      if(affected){
        const updatedMovie = await this.movieRepository.findOne( { where: { id: movieData.id, user: userId } } );
        return APIResponse.success(updatedMovie, "Movie updated successfully");
      }
      return APIResponse.notFound();


    } catch (error) {
      // Return an internal server error response
      return APIResponse.internalServerError();
    }
  }


  async deleteMovie(userId: number, movieId: number) {
    try {
     const { affected } = await this.movieRepository.delete({ id: movieId, user: userId });
     if(affected){
      return APIResponse.success("Movie deleted successfully");
     }
     return APIResponse.notFound();
    } catch (error) {
      // Return an internal server error response
      return APIResponse.internalServerError();
    }
  }
}

export default MovieService;
