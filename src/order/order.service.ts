import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductService } from 'src/products/service/products.service';
import { Order } from './order.mongo';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { UserService } from 'src/user/user.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private cartService: CartService,
    private userService: UserService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const fountUser = await this.userService.findById(createOrderDto.user);
    if (!fountUser) {
      throw new NotFoundException('user not found');
    }
    console.log(createOrderDto.products, 'producd');
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const order = new this.orderModel({
      products: createOrderDto.products,
      shippingAddress: createOrderDto.address,
      status: 'Delivered',
      shipping: createOrderDto.shipping,
      user: fountUser,
      subtotal: createOrderDto.subtotal,
      tax: createOrderDto.tax,
      total: createOrderDto.total,
      code: randomCode,
    });
    await this.cartService.clearUserCart(fountUser._id);
    return await order.save();
  }

  // Get all orders (with pagination or filtering as needed)
  async findAll(userId?: string): Promise<Order[]> {
    if (userId) {
      const user = await this.userService.findById(userId);
      return this.orderModel
        .find({
          user: user,
        })
        .exec();
    }
    return this.orderModel.find().exec();
  }

  // Get an order by ID
  async findOne(id: string): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderModel
      .findById(id)
      .populate('products')
      .populate('user')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  // Update an order by ID
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new NotFoundException('Order not found');
    }

    return deletedOrder;
  }

  async findByUser(userId: string): Promise<Order[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.orderModel.find({ user: userId }).exec();
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.orderModel.find({ status }).exec();
  }

  async getDailySales() {
    return this.orderModel.aggregate([
      {
        $match: {
          status: 'Delivered',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalSales: { $sum: '$total' },
          ordersCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: '$_id',
          totalSales: 1,
          ordersCount: 1,
          _id: 0,
        },
      },
    ]);
  }
}
