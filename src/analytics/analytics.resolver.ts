import { Query, Resolver } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsMonthlyOrders,
  AnalyticsRevenue,
  ReviewCount,
  TotalRevenu,
} from './entities/analytics.entity';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => AnalyticsRevenue)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getTotalRevenue() {
    return await this.analyticsService.getTotalRevenue();
  }

  @Query(() => AnalyticsMonthlyOrders)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getMonthlyOrdersCount() {
    return await this.analyticsService.getMonthlyOrdersCount();
  }

  @Query(() => TotalRevenu)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getTotalRevenueForLastSixMonths() {
    return await this.analyticsService.getTotalRevenueForLastSixMonths();
  }

  @Query(() => TotalRevenu)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getTotalOrdersForLastSixMonths() {
    return await this.analyticsService.getTotalOrdersForLastSixMonths();
  }

  @Query(() => ReviewCount)
  // @UseGuards(AuthGuard)
  // @Roles(['Admin'])
  // @UseGuards(RolesGuard)
  async getReviewCountsForLastSixMonths() {
    return await this.analyticsService.getReviewCountsForLastSixMonths();
  }
}
