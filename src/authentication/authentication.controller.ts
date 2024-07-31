import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { Response } from 'express';
import { SignupDto } from './dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid Email or Password Used',
        error: 'Unauthorized',
        statusCode: 401,
      });
    }
    const { access_token } = await this.authService.login(user);
    res.cookie('access_token', access_token, { httpOnly: true });
    return res.send({ access_token });
  }

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    const role = body.role ?? 'customer';
    return this.authService.signup(body.email, body.password, body.name, role);
  }
}
