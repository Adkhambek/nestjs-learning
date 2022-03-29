import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SERET } from 'src/config';
import { RequestExpress } from 'src/types/requestExpress.interface';
import { JwtPayloadId } from '../types/JwtPayloadId.interface';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: RequestExpress, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const { id } = verify(token, JWT_SERET) as JwtPayloadId;
      const user = await this.userService.findById(id);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
