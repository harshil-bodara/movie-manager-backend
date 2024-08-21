import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { APIResponse } from 'src/utils/common/apiResponse';
import { SignUpDto, LoginDto } from './auth.dto'
import  UsersEntity  from 'src/database/entities/users.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}


  async signup(signUpDto: SignUpDto) {
    try {
      const { email, password, } = signUpDto;

      const isUsersExits = await this.usersRepository.findOne({
        where: { email },
      });

      if (isUsersExits) {
        return APIResponse.conflict('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const users = await this.usersRepository.create({
        email,
        password: hashedPassword
      });

      await this.usersRepository.save(users);

      const verificationToken = this.jwtService.sign({
        id: users.id,
        email: users.email,
        isVerified: users.isVerified,
      });
      const verificationLink = `${process.env.FRONTEND_URL}/auth/verify?token=${verificationToken}`;
      console.log("verificationLink", verificationLink);

      return APIResponse.success(
        {},
        'You have registered successfully!, please check your mail!',
      );
    } catch (error) {
      return APIResponse.internalServerError(
        'There is some internal server error. Please try again!!',
      );
    }
  }

  async login(loginDto: LoginDto){
    try {
      const { email, password } = loginDto;
      const users = await this.usersRepository.findOne({
        where: { email },
      });

      if (!users) {
        return APIResponse.notFound("Your email doesn't exist.");
      }

      const isPasswordMatched = await bcrypt.compare(password, users.password);

      if (!isPasswordMatched) {
        return APIResponse.unauthorized('Invalid Password');
      }

      if (!users.isVerified) {
        return APIResponse.unauthorized('Your email not verified');
      }

      const authToken = this.jwtService.sign({
        id: users.id,
        email: users.email,
        isVerified: users.isVerified,
      });

      delete users.password;

      return APIResponse.success(
        { token: authToken, users },
        'Login successfully',
      );
    } catch (error) {
      return APIResponse.internalServerError(
        'There is some internal server error. Please try again!!',
      );
    }
  }

  async verify(token:string){
    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.id;

      const users = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!users) {
        return APIResponse.conflict("Your email does't register with us");
      }

      if (users.isVerified) {
        return APIResponse.success('Your account already verified with us');
      }

      users.isVerified = true;
      await this.usersRepository.save(users);

      return APIResponse.success('Email verified successfully');
    } catch (error) {
      return APIResponse.unauthorized('Invalid or expired token');
    }
  }

  // Verify Email and Resend Mail
  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.decode(token);  
      const id = decoded.id;

      if(!id) {
        return APIResponse.unauthorized('Invalid or expired token');
      }

      let user = await this.usersRepository.findOne({
          where: { id },
        });
  

      if (!user) {
        return APIResponse.conflict("Your email does't register with us");
      }

      if (user?.isVerified) {
        return APIResponse.success('Your account already verified with us');
      }
      else{
        const verify = this.jwtService.verify(token);
        if(!verify) {
          return APIResponse.unauthorized('Invalid or expired token');
        }
      }

      if(user) {
        user.isVerified = true;
        await this.usersRepository.save(user);
      }

      return APIResponse.success('Email verified successfully');
    } catch (error) {
      return APIResponse.unauthorized('Invalid or expired token');
    }
  }

  async resendEmail(token: string) {
    try {
      const decoded = this.jwtService.decode(token);
      const id = decoded.id;

      let user = await this.usersRepository.findOne({
          where: { id },
        });

        if(user && !user.isVerified) {
          const verificationToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
            isVerified: user.isVerified,
          });
          const verificationLink = `${process.env.FRONTEND_URL}/auth/verify?token=${verificationToken}`;
          console.log("verificationLink", verificationLink);
          return APIResponse.success('Email resent successfully');
        }

      if (!user) {
        return APIResponse.conflict("Your email does't register with us");
      }

      if (user?.isVerified) {
        return APIResponse.success('Your account already verified with us');
      }


    }catch(error) {
      return APIResponse.internalServerError();
    }
  }
}
