import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUser {
  readonly username: string;

  readonly email: string;

  readonly bio: string;

  readonly image: string;
}
