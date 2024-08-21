import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() SignUpDto: SignUpDto) {
    return this.authService.signup(SignUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/verifyEmail')
  verify(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('/resendEmail')
  resendEmail(@Body('token') token: string) {
    return this.authService.resendEmail(token);
  }
}
