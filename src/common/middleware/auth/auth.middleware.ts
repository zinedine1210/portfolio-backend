import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private config: ConfigService,
    private logger: LoggerService
  ) {}
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    const secretKey = req.headers['x-secret-key'];
    const isProd = this.config.get('NODE_ENV') === 'production';

    if(isProd && secretKey !== this.config.get('SECRET_KEY')) {
      this.logger.logWarning('Secret key is not valid');
      throw new UnauthorizedException('Secret key is not valid');
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, this.config.get('JWT_SECRET') as string) as any;
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (err) {
      throw new UnauthorizedException('Token invalid or expired');
    }
  }
}
