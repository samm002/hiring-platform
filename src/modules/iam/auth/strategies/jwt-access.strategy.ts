// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { JwtPayload } from '../interfaces';

// @Injectable()
// export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     configService: ConfigService,
//     private adminService: AdminService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('jwt.accessToken.secret')!,
//     });
//   }

// //   async validate(payload: JwtPayload) {
// //     const admin = await this.adminService.findAuthorizedAdminById(payload.sub);

// //     return admin;
// //   }
// // }
