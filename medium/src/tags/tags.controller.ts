import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Get()
  async getAllTags(): Promise<{ tags: string[] }> {
    const tags = await this.tagsService.getAllTags();
    return {
      tags: tags.map((val) => val.name),
    };
  }
}
