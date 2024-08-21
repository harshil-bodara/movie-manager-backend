import { IsNotEmpty } from "class-validator";

export class MovieDto {
        @IsNotEmpty()
        title: string;
      
        @IsNotEmpty()
        publishedYear: string;

        @IsNotEmpty()
        poster: string;
      }
      