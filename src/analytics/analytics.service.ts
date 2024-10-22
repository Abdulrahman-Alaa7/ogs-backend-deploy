import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalRevenue() {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const currentMonthOrders = await this.prisma.order.findMany({
      where: {
        status: 'Done',
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      select: { order: true },
    });

    const lastMonthOrders = await this.prisma.order.findMany({
      where: {
        status: 'Done',
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
      select: { order: true },
    });

    let currentMonthRevenue = 0;
    currentMonthOrders.forEach((order) => {
      order.order.forEach((item) => {
        currentMonthRevenue += item.price * item.quantity;
      });
    });

    let lastMonthRevenue = 0;
    lastMonthOrders.forEach((order: any) => {
      order.order.forEach((item: any) => {
        lastMonthRevenue += item.price * item.quantity;
      });
    });

    return { currentMonthRevenue, lastMonthRevenue };
  }

  async getMonthlyOrdersCount() {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const currentMonthOrdersCount = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    const lastMonthOrdersCount = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    return { currentMonthOrdersCount, lastMonthOrdersCount };
  }

  async getTotalRevenueForLastSixMonths() {
    const chartData: any[] = [];

    for (let i = 0; i < 6; i++) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));

      const orders = await this.prisma.order.findMany({
        where: {
          status: 'Done',
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        select: { order: true },
      });

      let monthlyRevenue = 0;
      orders.forEach((order) => {
        order.order.forEach((item) => {
          monthlyRevenue += item.price * item.quantity;
        });
      });

      const monthName = format(monthStart, 'MMMM');
      chartData.unshift({ month: monthName, total: monthlyRevenue });
    }

    return { chartData };
  }

  async getTotalOrdersForLastSixMonths() {
    const chartData: any[] = [];

    for (let i = 0; i < 6; i++) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));

      const orderCount = await this.prisma.order.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      const monthName = format(monthStart, 'MMMM');
      chartData.unshift({ month: monthName, total: orderCount });
    }

    return { chartData };
  }

  async getReviewCountsForLastSixMonths() {
    const counts = [0, 0, 0, 0, 0];
    let totalReviews = 0;

    for (let i = 0; i < 6; i++) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));

      for (let rating = 1; rating <= 5; rating++) {
        const count = await this.prisma.review.count({
          where: {
            rating: rating,
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        });

        counts[rating - 1] += count;
        totalReviews += count;
      }
    }

    return { totalReviews, counts };
  }
}
