import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CreateUser } from './dto/createUser.dto';
import { LoginUser } from './dto/loginUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserService } from './user.service';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUser } from './dto/updateUser.dto';

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
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') userDto: UpdateUser,
  ): Promise<UserResponseInterface> {
    const result = await this.userService.updateUser(currentUserId, userDto);
    return this.userService.buildUserResponse(result);
  }
}
