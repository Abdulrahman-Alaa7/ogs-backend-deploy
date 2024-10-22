import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { MessageResponse } from 'src/types/user.types';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => MessageResponse)
  async createReview(
    @Args('createReviewDto') createReviewDto: CreateReviewDto,
  ): Promise<MessageResponse> {
    return await this.reviewsService.createReview(createReviewDto);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async updateReview(
    @Args('updateReviewDto')
    updateReviewDto: UpdateReviewDto,
  ): Promise<MessageResponse> {
    return await this.reviewsService.updateReview(updateReviewDto);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async deleteReview(
    @Args('id')
    id: string,
  ): Promise<MessageResponse> {
    return await this.reviewsService.deleteReview(id);
  }

  @Query(() => [Review])
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getReviewsForAdmin(
    @Args('id')
    id: string,
  ) {
    return await this.reviewsService.getReviewsForAdmin(id);
  }

  @Query(() => [Review])
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getReviews() {
    return await this.reviewsService.getReviews();
  }

  @Query(() => [Review])
  async getReviewsForUsers(
    @Args('id')
    id: string,
  ) {
    return await this.reviewsService.getReviewsForUsers(id);
  }
}
