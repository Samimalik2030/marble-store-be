import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';

export class ShippingAdress {
  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: String })
  city: string;

  @ApiProperty({ type: String })
  state: string;

  @ApiProperty({ type: String })
  apartment: string;

  @ApiProperty({ type: Number })
  zip: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [String], description: 'Array of product IDs' })
  @IsArray()
  @IsNotEmpty()
  products: string[];


  @ApiProperty({
    type: String,
    description: 'User ID associated with the order',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ example: 'Pending', description: 'Order status' })
  @IsString()
  subtotal: string;

  @ApiProperty({ example: 'Pending', description: 'Order status' })
  @IsString()
  shipping: string;

  @ApiProperty({ example: 'Pending', description: 'Order status' })
  @IsString()
  tax: string;

  @ApiProperty({ example: 'Pending', description: 'Order status' })
  @IsString()
  total: string;

  @ApiProperty({
    type: ShippingAdress,
    description: 'Shipping address of the order',
  })
  @IsObject()
  @Type(() => ShippingAdress)
  address: ShippingAdress;
}

export class UpdateOrderDto {
  @ApiProperty({
    type: [String],
    description: 'Array of product IDs',
    required: false,
  })
  @IsArray()
  @IsOptional()
  products?: string[]; // Optional array of product IDs

  @ApiProperty({
    type: String,
    description: 'User ID associated with the order',
    required: false,
  })
  @IsString()
  @IsOptional()
  user?: string; // Optional user ID

  @ApiProperty({
    example: 'Shipped',
    description: 'Order status',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 120,
    description: 'Subtotal of the order',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  subtotal?: number;

  @ApiProperty({ example: 30, description: 'Shipping cost', required: false })
  @IsNumber()
  @IsOptional()
  shipping?: number;

  @ApiProperty({
    type: ShippingAdress,
    description: 'Shipping address of the order',
    required: false,
  })
  @IsObject()
  @Type(() => ShippingAdress)
  @IsOptional()
  shippingAddress?: ShippingAdress;

  @ApiProperty({
    example: 15,
    description: 'Tax applied to the order',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  tax?: number;

  @ApiProperty({
    example: 150,
    description: 'Total cost of the order',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  total?: number;
}
