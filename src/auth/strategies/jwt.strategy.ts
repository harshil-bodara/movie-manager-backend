import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import UsersEntity from 'src/database/entities/users.entity';
import { APIResponse } from 'src/utils/common/apiResponse';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @Inject(ConfigService) private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload:any) {
    const { id } = payload;

    let user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      return APIResponse.unauthorized('Invalid user');
    }

    return user;
  }
}