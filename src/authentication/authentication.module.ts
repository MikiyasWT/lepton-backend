// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';
// import { JwtAuthGuard } from './jwt-auth.guard';

// @Module({
//   imports: [JwtModule.register({
//     secret: process.env.JWT_SECRET,
//     signOptions: { expiresIn: '1h' }, // Adjust expiration as needed
//   })],
//   providers: [JwtStrategy],
//   exports: [JwtAuthGuard],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './authentication.controller';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
