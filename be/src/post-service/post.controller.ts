import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth-service/guards/jwt-auth.guard";
import { PostService } from "./post.service";

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
}