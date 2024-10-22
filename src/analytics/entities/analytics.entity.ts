import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AnalyticsRevenue {
  @Field(() => Int)
  currentMonthRevenue: number;

  @Field(() => Int)
  lastMonthRevenue: number;
}

@ObjectType()
export class AnalyticsMonthlyOrders {
  @Field(() => Int)
  currentMonthOrdersCount: number;

  @Field(() => Int)
  lastMonthOrdersCount: number;
}

@ObjectType()
export class TotalRevenueEntity {
  @Field()
  month: string;

  @Field()
  total: number;
}

@ObjectType()
export class TotalRevenu {
  @Field(() => [TotalRevenueEntity])
  chartData: TotalRevenueEntity[];
}

@ObjectType()
export class ReviewCount {
  @Field(() => [Int])
  counts: number;

  @Field(() => Int)
  totalReviews: number;
}
