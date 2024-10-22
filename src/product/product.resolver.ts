import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product, ProductWithSug } from './entities/product.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { ProductResponse } from 'src/types/product.types';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { MessageResponse } from 'src/types/user.types';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getProducts() {
    return await this.productService.getProducts();
  }

  @Query(() => Product)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getProductById(@Args('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Mutation(() => ProductResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async createProduct(
    @Args('productDto') productDto: ProductDto,
  ): Promise<ProductResponse> {
    return await this.productService.createProduct(productDto);
  }

  @Mutation(() => ProductResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async updateProduct(
    @Args('updateProductDto')
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponse> {
    return await this.productService.updateProduct(updateProductDto);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async deleteProduct(
    @Args('id')
    id: string,
  ): Promise<MessageResponse> {
    return await this.productService.deleteProduct(id);
  }

  @Query(() => [Product])
  async getProductsForClients() {
    return await this.productService.getProductsForClients();
  }

  @Query(() => ProductWithSug)
  async getProductByIdForClients(@Args('id') id: string) {
    return await this.productService.getProductByIdForClients(id);
  }

  @Query(() => [Product])
  async getTopSellingWithLimit() {
    return await this.productService.getTopSellingWithLimit();
  }

  @Query(() => [Product])
  async getTopRatedWithLimit() {
    return await this.productService.getTopRatedWithLimit();
  }

  @Query(() => [Product])
  async getNewProductsWithLimit() {
    return await this.productService.getNewProductsWithLimit();
  }

  @Query(() => [Product])
  async getTopSelling() {
    return await this.productService.getTopSelling();
  }

  @Query(() => [Product])
  async getTopRated() {
    return await this.productService.getTopRated();
  }
}
