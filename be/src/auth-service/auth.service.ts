import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user-service/user.service';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { TokenService } from 'src/token-service/token.service';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/core/mail/mail.service';

dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(username: string, pass: string): Promise<Partial<User>> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials!');
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { username } = registerDto;
    const existingUser = await this.userService.findByUsername(username);
    if (!existingUser) {
      const createUserDto = {
        username: registerDto.username,
        password: registerDto.password,
      };
      return this.userService.create(createUserDto);
    }
    throw new ConflictException(`Username ${username} already exists!`);
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const secretKey = this.configService.get('JWT_SECRET');
    const refreshSecret = this.configService.get('REFRESH_SECRET');
    const accessToken = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });
    await this.tokenService.saveRefreshToken(user, refreshToken);
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenFromUser: string) {
    const payload = this.jwtService.verify(refreshTokenFromUser, {
      secret: this.configService.get('REFRESH_SECRET'),
    });

    // Validate payload decoded from refresh token
    if (!payload || typeof payload !== 'object' || !payload.sub)
      throw new UnauthorizedException('Invalid refresh token');
    const { sub } = payload;

    // Validate is token entity exists in DB of userId (sub)
    const tokenEntity = await this.tokenService.findRefreshToken(+sub);
    if (!tokenEntity)
      throw new NotFoundException(
        'Decoded userId from token have no tokens in DB!',
      );

    // Validate expire token
    if (tokenEntity.expiryDate < new Date())
      throw new UnauthorizedException('Refresh token has expired!');

    // Validate refreshToken hashed bcrypt
    const isRefreshToValidHashed = await bcrypt.compare(
      refreshTokenFromUser,
      tokenEntity.value,
    );
    if (!isRefreshToValidHashed)
      throw new ForbiddenException(
        'Refesh token is not a valid hashed compare!',
      );

    const newPayload = {
      username: tokenEntity.user.username,
      sub: tokenEntity.user.id,
    };
    const newAccessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return { accessToken: newAccessToken };
  }

  async sendEmailVerification(
    userId: number,
    userEmail: string,
  ): Promise<void> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException(`User id-${userId} not found!`);
    const payload = { username: user.username, sub: userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15d',
    });
    user.emailVerificationToken = token;
    await this.userService.save(user);
    await this.mailService.sendEmailVerification(userEmail, token);
  }

  async verifyEmail(token: string) {
    const user = await this.userService.findOneByEmailVerificationToken(token);
    if (!user) {
      throw new NotFoundException('Không tìm thấy User nào có token này!');
    }
    if (user.isEmailVerified) {
      throw new NotFoundException(
        'This account has verified email done before! Can"t do this again!',
      );
    }
    // Validate token expired here...
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      if (Date.now() >= payload.exp * 1000) {
        throw new UnauthorizedException(
          '1. Token đã hết hạn, vui lòng yêu cầu gửi lại email xác thực.',
        );
      }
      await this.userService.verifyUserEmail(user);
      return { message: 'Email đã được xác thực thành công! Chúc mừng.' };
    } catch (error) {
      console.error('error=', error);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          '2. Token đã hết hạn, vui lòng yêu cầu gửi lại email xác thực.',
        );
      }
      throw new UnauthorizedException('Token không hợp lệ.');
    }
  }
}
