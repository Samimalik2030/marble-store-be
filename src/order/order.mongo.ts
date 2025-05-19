import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { BaseSchema } from 'src/common/base.schema';
import { transformObjectId } from 'src/common/transform-to-obj';
import { Schema, Types } from 'mongoose';
import { MongoSchema } from 'src/decorator/mongo-schema.decorator';
import { Product } from 'src/products/schema/product.mongo';
import { User } from 'src/user/user.mongo';
import { ShippingAdress } from './order.dto';

@MongoSchema()
export class Order extends BaseSchema {
  @ApiProperty({ type: [String] })
  @Prop({type:[String]})
  products: string[];

  @ApiProperty({ type: () => User })
  @Prop({ type: Schema.Types.ObjectId, ref: 'User', required: true })
  @Transform(transformObjectId)
  user: User;

  @ApiProperty({ example: 'Processing' })
  @Prop({ default: 'Pending' })
  status: string;


  @ApiProperty({ example: 'Processing' })
  @Prop({ default: 'Pending' })
  code: string;

  @ApiProperty({ example: 1200 })
  @Prop({ required: true })
  subtotal: number;

  @ApiProperty({ example: 100 })
  @Prop({ required: true })
  shipping: number;

  @ApiProperty({ type: ShippingAdress })
  @Prop({ type: Object, required: true })
  @Type(() => ShippingAdress)
  shippingAddress: ShippingAdress;

  @ApiProperty({ example: 120 })
  @Prop({ required: true })
  tax: number;

  @ApiProperty({ example: 1420 })
  @Prop({ required: true })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
