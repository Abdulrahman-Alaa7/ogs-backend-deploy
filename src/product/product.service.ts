import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts() {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  }

  async getProductsForClients() {
    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        reviews: true,
      },
    });

    return product;
  }

  async getProductByIdForClients(id: string) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
        publicPro: true,
      },
      include: {
        reviews: {
          where: {
            status: true,
          },
        },
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
    });

    const filteredProducts = Array.isArray(products)
      ? products.filter((product) => product?.id !== id)
      : [];

    const randomProducts = [...filteredProducts]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return { product, randomProducts };
  }

  async createProduct(productDto: ProductDto) {
    const {
      name,
      mainImage,
      images,
      descriptionEn,
      descriptionAr,
      price,
      estimatedPrice,
      offer,
      aiGen,
      soldOut,
      publicPro,
    } = productDto;

    let imageUrl;
    if (mainImage) {
      imageUrl = await this.storeImageAndGetURL(mainImage);
    } else {
      imageUrl = null;
    }

    let imageUrls: any[] = [];
    if (images && images.length > 0) {
      imageUrls = await Promise.all(
        images.slice(0, 11).map((image) => this.storeImageAndGetURL(image)),
      );
    }

    const product = await this.prisma.product.create({
      data: {
        name,
        mainImage: imageUrl,
        images: imageUrls,
        descriptionEn,
        descriptionAr,
        price,
        estimatedPrice,
        offer,
        aiGen,
        soldOut,
        publicPro,
      },
    });
    return { product };
  }

  async updateProduct(updateproductDto: UpdateProductDto) {
    const {
      id,
      name,
      mainImage,
      images,
      descriptionEn,
      descriptionAr,
      price,
      estimatedPrice,
      offer,
      aiGen,
      soldOut,
      publicPro,
    } = updateproductDto;

    const productItem = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!productItem) {
      throw new BadRequestException('Product not found');
    }

    const oldImageUrl: any = (await productItem).mainImage;

    let imageUrl;
    if (mainImage) {
      if (oldImageUrl) {
        const imagePath = oldImageUrl.replace(`${process.env.APP_URL}/`, '');
        const fullImagePath = join(process.cwd(), 'public', imagePath);

        fs.unlink(fullImagePath, (err: any) => {
          if (err) {
            // console.error(`Error deleting image: ${err.message}`);
          } else {
            // console.log(`Image deleted successfully: ${fullImagePath}`);
          }
        });
      }
      imageUrl = await this.storeImageAndGetURL(mainImage);
    } else {
      if (oldImageUrl) {
        imageUrl = (await productItem).mainImage;
      } else {
        imageUrl = null;
      }
    }

    let imageUrls: any[] = (await productItem).images || [];

    if (images && images.length > 0) {
      if (imageUrls.length > 0) {
        await Promise.all(
          imageUrls.map(async (oldImageUrl) => {
            const imagePath = oldImageUrl.replace(
              `${process.env.APP_URL}/`,
              '',
            );
            const fullImagePath = join(process.cwd(), 'public', imagePath);
            fs.unlink(fullImagePath, (err: any) => {
              if (err) {
                // console.error(`Error deleting image: ${err.message}`);
              } else {
                // console.log(`Image deleted successfully: ${fullImagePath}`);
              }
            });
          }),
        );
      }

      imageUrls = await Promise.all(
        images.slice(0, 11).map((image) => this.storeImageAndGetURL(image)),
      );
    }

    const product = await this.prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        mainImage: imageUrl,
        images: imageUrls,
        descriptionEn,
        descriptionAr,
        price,
        estimatedPrice,
        offer,
        aiGen,
        soldOut,
        publicPro,
      },
    });
    return { product };
  }

  private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
    const { createReadStream, filename } = await file;

    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(
      process.cwd(),
      'public',
      'imgs-products',
      uniqueFilename,
    );
    const imageUrl = `${process.env.APP_URL}/imgs-products/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));

    return imageUrl;
  }

  async deleteProduct(id: string) {
    const productItem = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productItem) {
      throw new BadRequestException('Product not found');
    }

    const oldImageUrl: any = productItem.mainImage;
    if (oldImageUrl) {
      const imagePath = oldImageUrl.replace(`${process.env.APP_URL}/`, '');
      const fullImagePath = join(process.cwd(), 'public', imagePath);

      fs.unlink(fullImagePath, (err: any) => {
        if (err) {
          //   console.error(`Error deleting image: ${err.message}`);
        } else {
          //   console.log(`Main image deleted successfully: ${fullImagePath}`);
        }
      });
    }

    const imageUrls: string[] = productItem.images || [];

    if (imageUrls.length > 0) {
      await Promise.all(
        imageUrls.map((imageUrl) => {
          const imagePath = imageUrl.replace(`${process.env.APP_URL}/`, '');
          const fullImagePath = join(process.cwd(), 'public', imagePath);

          return new Promise((resolve, reject) => {
            fs.unlink(fullImagePath, (err: any) => {
              if (err) {
                // console.error(`Error deleting image: ${err.message}`);
                reject(err);
              } else {
                // console.log(`Image deleted successfully: ${fullImagePath}`);
                resolve(true);
              }
            });
          });
        }),
      );
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        productId: id,
      },
    });

    if (reviews) {
      await this.prisma.review.deleteMany({
        where: {
          productId: id,
        },
      });
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: `Product Deleted Successfully` };
  }

  async getTopSellingWithLimit() {
    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      orderBy: {
        purchased: 'desc',
      },
      take: 6,
    });

    return products;
  }

  async getTopRatedWithLimit() {
    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      take: 6,
      orderBy: {
        reviews: {
          _count: 'desc',
        },
      },
      include: {
        reviews: true,
      },
    });

    return products;
  }

  async getNewProductsWithLimit() {
    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  }

  async getTopSelling() {
    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      orderBy: {
        purchased: 'desc',
      },
    });

    return products;
  }

  async getTopRated() {
    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      orderBy: {
        reviews: {
          _count: 'desc',
        },
      },
      include: {
        reviews: true,
      },
    });

    return products;
  }
}
