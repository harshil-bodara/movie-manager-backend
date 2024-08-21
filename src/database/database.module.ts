import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { config } from 'dotenv';
import { dataSourceOption } from './data-source';

const NODE_ENV = process.env.NODE_ENV;

config({
    path: path.resolve(
        process.cwd(),
        'env',
        !NODE_ENV ? '.env.development' : `.env.${NODE_ENV}`,
    ),
});

const repositories = TypeOrmModule.forFeature([]);

@Global()
@Module({
    imports:[TypeOrmModule.forRoot(dataSourceOption), repositories],
    exports: [repositories],
})
export class DatabaseModule { }