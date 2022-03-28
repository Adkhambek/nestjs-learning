import { Controller, Get } from '@nestjs/common';

@Controller('tags')
export class TagsController {
  @Get()
  getAllTags() {
    return ['javascript', 'php'];
  }
}
