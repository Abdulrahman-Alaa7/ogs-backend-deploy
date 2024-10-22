import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { ReviewGateway } from './review.gateway';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewGateway: ReviewGateway,
  ) {}

  async createReview(createReviewDto: CreateReviewDto) {
    const { rating, name, message, productId } = createReviewDto;

    const settings = await this.prisma.settings.findMany({});

    if (settings.length > 0 && settings[0].airPlaneMode === true) {
      throw new BadRequestException(
        'Sorry! We are in airplane mode right now, try later.',
      );
    }

    await this.prisma.review.create({
      data: {
        rating,
        name,
        message,
        productId,
      },
    });

    await this.prisma.notification.create({
      data: {
        message: `A new review from ${name}`,
        theId: productId,
      },
    });

    this.reviewGateway.sendReviewNotification({
      message: `A new review from ${name}`,
      theId: productId,
    });

    return { message: `Review Created Successfully` };
  }

  async updateReview(updateReviewDto: UpdateReviewDto) {
    const { id, status } = updateReviewDto;

    await this.prisma.review.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return { message: `Review Updated Successfully` };
  }

  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: id,
      },
    });

    if (!review) {
      throw new BadRequestException('Review not found');
    }

    await this.prisma.review.delete({
      where: {
        id: id,
      },
    });

    return { message: `Review Deleted Successfully` };
  }

  async getReviewsForAdmin(id: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        productId: id,
      },
    });

    return reviews;
  }

  async getReviews() {
    const reviews = await this.prisma.review.findMany({});

    return reviews;
  }

  async getReviewsForUsers(id: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        productId: id,
        status: true,
      },
    });

    return reviews;
  }
}
