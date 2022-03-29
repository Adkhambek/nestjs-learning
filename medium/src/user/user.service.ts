import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUser } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SERET } from 'src/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUser } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUser } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(user: CreateUser): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: user.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: user.username,
    });
    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Username or email has been taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    const entity = Object.assign(newUser, user);
    return await this.userRepository.save(entity);
  }
  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }
  async login(user: LoginUser): Promise<UserEntity> {
    const userExist = await this.userRepository.findOne(
      {
        email: user.email,
      },
      { select: ['id', 'username', 'email', 'password', 'bio', 'image'] },
    );

    if (!userExist) {
      throw new HttpException(
        'There is not such user',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(user.password, userExist.password);

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Password is incorrect',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete userExist.password;
    return userExist;
  }
  async updateUser(id: number, updateUser: UpdateUser): Promise<UserEntity> {
    const user = await this.findById(id);
    const udatedUser = Object.assign(user, updateUser);
    return await this.userRepository.save(udatedUser);
  }
  generateJWT(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SERET,
    );
  }
  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }
}
