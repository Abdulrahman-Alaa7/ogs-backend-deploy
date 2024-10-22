import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  SettingsDto,
  SettingsHeroDto,
  SettingsUpdateDto,
  UpdayteSettingsHeroDto,
} from './dto/settings.dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSettings(settingsDto: SettingsDto) {
    const {
      shippingPrice,
      freeShippingPrice,
      freeShipDescEn,
      freeShipDescAr,
      addressOgs,
      airPlaneMode,
    } = settingsDto;

    const settings = await this.prisma.settings.create({
      data: {
        shippingPrice,
        freeShippingPrice,
        freeShipDescEn,
        freeShipDescAr,
        addressOgs,
        airPlaneMode,
      },
    });
    return { settings };
  }

  async updateSettings(settingsUpdateDto: SettingsUpdateDto) {
    const {
      id,
      shippingPrice,
      freeShippingPrice,
      freeShipDescEn,
      freeShipDescAr,
      addressOgs,
      airPlaneMode,
    } = settingsUpdateDto;
    const idSettings = id;

    const settings = await this.prisma.settings.update({
      where: {
        id: idSettings,
      },
      data: {
        shippingPrice,
        freeShippingPrice,
        freeShipDescEn,
        freeShipDescAr,
        addressOgs,
        airPlaneMode,
      },
    });

    return { settings };
  }

  async getSettings() {
    const settings = await this.prisma.settings.findMany({});

    return settings;
  }

  async createSettingsHero(settingsHeroDto: SettingsHeroDto) {
    const { image, titleEn, titleAr, descEn, descAr } = settingsHeroDto;

    let imageUrl;
    if (image) {
      imageUrl = await this.storeImageAndGetURL(image);
    } else {
      imageUrl = null;
    }

    const settingsHero = await this.prisma.settingsHero.create({
      data: {
        image: imageUrl,
        titleEn,
        titleAr,
        descEn,
        descAr,
      },
    });
    return { settingsHero };
  }

  async updateSettingsHero(updayteSettingsHeroDto: UpdayteSettingsHeroDto) {
    const { id, image, titleEn, titleAr, descEn, descAr } =
      updayteSettingsHeroDto;

    const HeroSetting = await this.prisma.settingsHero.findUnique({
      where: {
        id: id,
      },
    });

    const oldImageUrl: any = (await HeroSetting).image;

    let imageUrl;
    if (image) {
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
      imageUrl = await this.storeImageAndGetURL(image);
    } else {
      if (oldImageUrl) {
        imageUrl = (await HeroSetting).image;
      } else {
        imageUrl = null;
      }
    }

    const settingsHero = await this.prisma.settingsHero.update({
      where: {
        id: id,
      },
      data: {
        image: imageUrl,
        titleEn,
        titleAr,
        descEn,
        descAr,
      },
    });
    return { settingsHero };
  }

  private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
    const { createReadStream, filename } = await file;

    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(
      process.cwd(),
      'public',
      'filesHero',
      uniqueFilename,
    );
    const imageUrl = `${process.env.APP_URL}/filesHero/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));

    return imageUrl;
  }

  async getSettingsHero() {
    const settings = await this.prisma.settingsHero.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return settings;
  }

  async deleteHero(id: string) {
    const hero = await this.prisma.settingsHero.findUnique({
      where: {
        id: id,
      },
    });

    const oldImageUrl: any = (await hero).image;

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

    if (!hero) {
      throw new BadRequestException('Hero not found');
    }

    await this.prisma.settingsHero.delete({
      where: {
        id: id,
      },
    });

    return { message: `Hero Deleted Successfully` };
  }
}
