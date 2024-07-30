import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (user) {
      const { access_token } = await this.authService.login(user);
      res.cookie('access_token', access_token, { httpOnly: true });
      return res.send({ access_token });
    }
    return res.status(401).send('Invalid credentials');
  }

  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return this.authService.signup(body.email, body.password, body.name);
  }
}
