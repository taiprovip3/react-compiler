import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth-service/guards/jwt-auth.guard";
import { PostService } from "./post.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { UploadThumbnailDto } from "./dto/upload-thumbnail.dto";
import { UploadSubImagesDto } from "./dto/upload-sub-images.dto";

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
    
  constructor(
    private readonly postService: PostService,
  ) {}

  @Get(':id')
  getUserPosts(@Param('id') userId: string) {
    return this.postService.getUserPosts(+userId);
  }

  @Put(':id')
  updatePost(@Param('id') postId: string, @Body() updateDto: any) {
    return this.postService.updatePost(+postId, updateDto);
  }

  @Delete(':id')
  deletePost(@Param('id') postId: string) {
    return this.postService.deletePost(+postId);
  }

  @Post('upload-thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  async uploadThumbnailImage(
    @Body() body: UploadThumbnailDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.postService.uploadThumbnailImage(body.postId, body.oldThumbnailUrl, file);
    return { message: 'Thumbnail uploaded successfully', post: result };
  }

  @Post('upload-sub-images')
  @UseInterceptors(FilesInterceptor('files', 9))
  async uploadSubImages(
    @Body() body: UploadSubImagesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.postService.uploadSubImages(body.postId, files);
    return { message: 'Sub images uploaded successfully', images: result };
  }
}