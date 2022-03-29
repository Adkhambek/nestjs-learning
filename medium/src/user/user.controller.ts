import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
} from '@nestjs/common';
import { CreateUser } from './dto/createUser.dto';
import { LoginUser } from './dto/loginUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserService } from './user.service';
import { RequestExpress } from '../types/requestExpress.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') user: CreateUser,
  ): Promise<UserResponseInterface> {
    const newUser = await this.userService.createUser(user);
    return this.userService.buildUserResponse(newUser);
  }
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') userLogin: LoginUser,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(userLogin);
    return this.userService.buildUserResponse(user);
  }
  @Get('user')
  async currentUser(
    @Req() request: RequestExpress,
  ): Promise<UserResponseInterface> {
    console.log(request.user);

    return this.userService.buildUserResponse(request.user);
  }
}
