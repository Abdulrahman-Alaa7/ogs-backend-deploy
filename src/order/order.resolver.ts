import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { OrdersEntity, RecentOrdersEntity } from './entities/order.entity';
import { MessageResponse } from '../types/user.types';
import { OrderDto, UpdateOrderDto } from './dto/order.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => OrdersEntity)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => MessageResponse)
  async createOrder(
    @Args('orderDto') orderDto: OrderDto,
  ): Promise<MessageResponse> {
    return await this.orderService.createOrder(orderDto);
  }

  @Query(() => [OrdersEntity])
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getOrders() {
    return await this.orderService.getOrders();
  }

  @Query(() => OrdersEntity)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getOrderById(@Args('id') id: string) {
    return await this.orderService.getOrderById(id);
  }

  @Mutation(() => OrdersEntity)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async updateOrder(
    @Args('updateOrderDto')
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrdersEntity> {
    return await this.orderService.updateOrder(updateOrderDto);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async deleteOrder(
    @Args('id')
    id: string,
  ): Promise<MessageResponse> {
    return await this.orderService.deleteOrder(id);
  }

  @Query(() => RecentOrdersEntity)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getRecentOrders() {
    return await this.orderService.getRecentOrders();
  }
}
