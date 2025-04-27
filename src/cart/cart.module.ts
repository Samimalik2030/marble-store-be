import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.mongo';

@Module({
  imports:[MongooseModule.forFeature([{name:Cart.name,schema:CartSchema}])],
  providers: [CartService],
  controllers: [CartController],
  exports:[CartService]
})
export class CartModule {}
