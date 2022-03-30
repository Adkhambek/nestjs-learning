import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { articleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { articlesInterface } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findAll(id: number, query: any): Promise<articlesInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');
    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}`,
      });
    }
    if (query.author) {
      const author = await this.userRepository.findOne({
        username: query.author,
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    if (query.favorited) {
      const author = await this.userRepository.findOne(
        { username: query.favorited },
        { relations: ['likes'] },
      );
      const ids = author.likes.map((el) => el.id);
      console.log(ids);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=2');
      }
    }
    let favoriteIds: number[] = [];
    if (id) {
      const currentUser = await this.userRepository.findOne(id, {
        relations: ['likes'],
      });
      favoriteIds = currentUser.likes.map((el) => el.id);
    }
    const articles = await queryBuilder.getMany();
    const articleWithLikes = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });
    return {
      articles: articleWithLikes,
      articlesCount,
    };
  }
  async createArticle(
    user: UserEntity,
    articleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    const newArticle = Object.assign(article, articleDto);
    if (!newArticle.tagList) {
      newArticle.tagList = [];
    }
    newArticle.author = user;
    newArticle.slug = this.getSlug(articleDto.title);
    return await this.articleRepository.save(newArticle);
  }
  buildArticleResponse(article: ArticleEntity): articleResponseInterface {
    return {
      article,
    };
  }
  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ slug });
  }

  async deleteArticle(slug: string, id: number): Promise<DeleteResult> {
    const article = await this.getArticleBySlug(slug);
    if (!article)
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    if (article.author.id !== id)
      throw new HttpException(
        'You are not author of this article',
        HttpStatus.FORBIDDEN,
      );
    return await this.articleRepository.delete({ slug });
  }
  async updateArticle(
    slug: string,
    body: CreateArticleDto,
    id: number,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);
    if (!article)
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    if (article.author.id !== id)
      throw new HttpException(
        'You are not author of this article',
        HttpStatus.FORBIDDEN,
      );
    const updatedArticle = Object.assign(article, body);
    return this.articleRepository.save(updatedArticle);
  }
  async addArticleToFavorites(
    slug: string,
    id: number,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ slug });
    const user = await this.userRepository.findOne(id, {
      relations: ['likes'],
    });
    const isNotLiked =
      user.likes.findIndex((val) => val.id === article.id) === -1;
    if (isNotLiked) {
      user.likes.push(article);
      article.likes++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }
  async deleteArticleFromFavorites(
    slug: string,
    id: number,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ slug });
    const user = await this.userRepository.findOne(id, {
      relations: ['likes'],
    });
    const articleIndex = user.likes.findIndex((val) => val.id === article.id);

    if (articleIndex >= 0) {
      user.likes.splice(articleIndex, 1);
      article.likes--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }
}
