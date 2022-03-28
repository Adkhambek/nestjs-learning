import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { UserModule } from './user/user.module';
import ormConfig from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
