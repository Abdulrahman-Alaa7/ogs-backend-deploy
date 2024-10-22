import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderDto, UpdateOrderDto } from './dto/order.dto';
import { EmailService } from '../email/email.service';
import { OrderGateway } from './order.gateway';
import * as cron from 'node-cron';

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly orderGateway: OrderGateway,
  ) {}

  onModuleInit() {
    this.scheduleOrderCleanup();
  }

  scheduleOrderCleanup() {
    cron.schedule('0 0 0 * * *', async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      await this.prisma.order.deleteMany({
        where: {
          createdAt: { lt: sixMonthsAgo },
        },
      });
    });
  }

  async createOrder(orderDto: OrderDto) {
    const {
      lang,
      fullName,
      email,
      phone_number,
      secPhone_number,
      governorate,
      secGovernorate,
      city,
      secCity,
      address,
      secAddress,
      order: orderArr,
      note,
    } = orderDto;

    const settings = await this.prisma.settings.findMany({});

    if (settings.length > 0 && settings[0].airPlaneMode === true) {
      throw new BadRequestException(
        'Sorry! We are in airplane mode right now, try later.',
      );
    }

    const freeShip: number = settings[0]?.freeShippingPrice;
    const shippingPrice: number = settings[0]?.shippingPrice;

    const totalPrice = orderArr.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const theShippingPrice: number = totalPrice > freeShip ? 0 : shippingPrice;

    const finalTotalPrice: number = Math.round(totalPrice + theShippingPrice);

    const order = await this.prisma.order.create({
      data: {
        fullName,
        email,
        phone_number,
        secPhone_number,
        governorate,
        secGovernorate,
        city,
        secCity,
        address,
        secAddress,
        order: orderArr,
        note,
      },
    });

    for (const item of orderArr) {
      await this.prisma.product.update({
        where: { id: item.id },
        data: { purchased: { increment: item.quantity } },
      });
    }

    {
      lang === 'en'
        ? await this.emailService.sendMail({
            email,
            subject: 'Order Confirmation',
            template: './order-confirmation.ejs',
            activationCode: fullName,
            name: fullName,
            order: {
              id: order.id.toString().slice(0, 6),
              date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              theShippingPrice,
              products: orderArr.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              totalPrice: finalTotalPrice,
            },
          })
        : await this.emailService.sendMail({
            email,
            subject: 'تأكيد الطلب',
            template: './order-confirmation-ar.ejs',
            activationCode: fullName,
            name: fullName,
            order: {
              id: order.id.toString().slice(0, 6),
              date: new Date().toLocaleDateString('ar', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              theShippingPrice,
              products: orderArr.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              totalPrice: finalTotalPrice,
            },
          });
    }

    await this.prisma.notification.create({
      data: {
        message: `A new order from ${fullName}`,
        theId: order.id,
      },
    });

    this.orderGateway.sendOrderNotification({
      message: `A new order from ${fullName}`,
      theId: order.id,
    });

    return { message: `Order Created Successfully` };
  }

  async getOrders() {
    const orders = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    return order;
  }

  async updateOrder(updateOrderDto: UpdateOrderDto) {
    const { id, status } = updateOrderDto;
    const theOrder = await this.prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    if (!theOrder) {
      throw new BadRequestException('Order not found');
    }

    const order = await this.prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return order;
  }

  async deleteOrder(id: string) {
    const theOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!theOrder) {
      throw new BadRequestException('Order not found');
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return { message: `Order Deleted Successfully` };
  }

  async getRecentOrders() {
    const recentOrders = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 7,
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const ordersThisMonthCount = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    return { recentOrders, ordersThisMonthCount };
  }
}
