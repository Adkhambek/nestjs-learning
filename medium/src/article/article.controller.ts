import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { articleResponseInterface } from './types/articleResponse.interface';
import { articlesInterface } from './types/articlesResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get()
  async getAllArticles(
    @User('id') id: number,
    @Query() query: any,
  ): Promise<articlesInterface> {
    return await this.articleService.findAll(id, query);
  }
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createArticle(
    @User() currentUser: UserEntity,
    @Body('article') article: CreateArticleDto,
  ): Promise<articleResponseInterface> {
    const newArticle = await this.articleService.createArticle(
      currentUser,
      article,
    );
    return this.articleService.buildArticleResponse(newArticle);
  }
  @Get(':slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<articleResponseInterface> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@User('id') id: number, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(slug, id);
  }
  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @User('id') id: number,
    @Param('slug') slug: string,
    @Body('article') articleDto: CreateArticleDto,
  ) {
    const article = await this.articleService.updateArticle(
      slug,
      articleDto,
      id,
    );
    return this.articleService.buildArticleResponse(article);
  }
  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') id: number,
    @Param('slug') slug: string,
  ): Promise<articleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(slug, id);
    return this.articleService.buildArticleResponse(article);
  }
  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @User('id') id: number,
    @Param('slug') slug: string,
  ): Promise<articleResponseInterface> {
    const article = await this.articleService.deleteArticleFromFavorites(
      slug,
      id,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
