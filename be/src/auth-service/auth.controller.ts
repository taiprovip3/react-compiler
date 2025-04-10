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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request as ExpressRequest, Response } from 'express';
import { RtGuard } from './guards/rt.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
      path: '/',
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

  /**
   * Để logout thành công thì request đó cần đính kèm accessToken vào bearer header
   * @param req
   * @param res
   * @returns
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken: string = req.cookies?.refreshToken;
    console.log('refreshToken=', refreshToken);
    if (!refreshToken) {
      throw new HttpException(
        'No refresh token found in cookies. You are not logged in!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = req.user;
    console.log('User logging out:', user);
    res.clearCookie('refreshToken', { path: '/' });
    return { message: 'Logged out!' };
  }
}
