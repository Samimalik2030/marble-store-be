// Inside cart.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCartDto, UpdateCartDto } from './cart.dto';
import { Cart, CartSchema } from './cart.mongo';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async addToCart(createCartDto: CreateCartDto): Promise<any> {
    // Example: prevent duplicate exact items
    const exists = await this.cartModel.findOne({
      user: createCartDto.user,
      product: createCartDto.product,
    });
    if (exists) {
      throw new BadRequestException('This item is already in the cart.');
    }

    const cartItem = await this.cartModel.create({
      user: createCartDto.user,
      product: createCartDto.product,
    });
    return {
      message: 'Product has been added to your cart',
      cart: cartItem,
    };
  }

  async getCartByUser(userId: string): Promise<Cart[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    return this.cartModel.find({ user: userId }).populate('product');
  }

  async getTotalSales(userId: string): Promise<any> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    const foundCarts = await this.cartModel
      .find({ user: userId })
      .populate('product');

    let subtotal = 0;
    foundCarts.forEach((cart) => {
      subtotal += cart.product.price * cart.quantity;
    });

    const shipping = 4.99;
    const tax = subtotal * 0.08;

    const total = subtotal + shipping + tax;

    // Return the order summary
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  }

  async getCartItem(id: string): Promise<Cart> {
    const item = await this.cartModel.findById(id).populate('product');
    if (!item) {
      throw new NotFoundException('Cart item not found.');
    }
    return item;
  }

  async updateCartItem(
    id: string,
    updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    const updated = await this.cartModel.findByIdAndUpdate(id, updateCartDto, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('Cart item not found.');
    }
    return updated;
  }

  async removeCartItem(id: string): Promise<any> {
    const deleted = await this.cartModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Cart item not found.');
    }
    return {
      message: 'Cart deleted sucessfully',
    };
  }

  async clearUserCart(userId: any): Promise<void> {
    await this.cartModel.deleteMany({ user: userId });
  }
}
