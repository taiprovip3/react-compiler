import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request as ExpressRequest, Response } from 'express';
import { RtGuard } from './guards/rt.guard';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * LocalAuthGuard sẽ kết hợp với LocalStrategy để lấy field 'username' và 'password' từ thân postman login.
   * @param req
   * @param res
   * @returns
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @Get('refresh-token')
  @UseGuards(RtGuard)
  async refresh(@Req() req: ExpressRequest) {
    const refreshToken: string = req.cookies['refreshToken'];
    return this.authService.refreshToken(refreshToken);
  }
}
