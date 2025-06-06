import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCartDto, UpdateCartDto } from './cart.dto';

@ApiTags('Cart')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  create(@Body() createCartDto: CreateCartDto) {
    console.log(createCartDto,'create caerd')
    return this.cartService.addToCart(createCartDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get cart items for a user' })
  @ApiResponse({ status: 200, description: 'User cart retrieved' })
  findByUser(@Param('userId') userId: string) {
    return this.cartService.getCartByUser(userId);
  }
  @Get('/summary/:userId')
  @ApiOperation({ summary: 'Get order summary for a user' })
  @ApiResponse({ status: 200, description: 'Order summary retrieved successfully' })
  findOrderSummary(@Param('userId') userId: string) {
    return this.cartService.getTotalSales(userId);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get a single cart item by ID' })
  @ApiResponse({ status: 200, description: 'Cart item retrieved' })
  findOne(@Param('id') id: string) {
    return this.cartService.getCartItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cart item' })
  @ApiResponse({ status: 200, description: 'Cart item updated' })
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCartItem(id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart item' })
  @ApiResponse({ status: 200, description: 'Cart item deleted' })
  remove(@Param('id') id: string) {
    return this.cartService.removeCartItem(id);
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: 'Clear all cart items for a user' })
  @ApiResponse({ status: 200, description: 'User cart cleared' })
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearUserCart(userId);
  }
}
