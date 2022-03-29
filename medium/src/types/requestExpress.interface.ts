import { Request } from 'express';
import { UserEntity } from '../user/user.entity';
export interface RequestExpress extends Request {
  user?: UserEntity;
}
