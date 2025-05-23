import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './token.mongo';
import { Model } from 'mongoose';
import { match } from 'assert';
import { TokenType } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async find(email: string, type: TokenType): Promise<Token> {
    const otp = await this.tokenModel.findOne({
      type: type,
      email: email,
    });
    return otp;
  }

  async findByEmailAndDelete(email: string, type: TokenType): Promise<Token> {
    const otp = await this.tokenModel.findOneAndDelete({
      type: type,
      email: email,
    });
    return otp;
  }

async generate(email: string, tokenType: TokenType): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const bcryptedToken = await bcrypt.hash(otp, 9);
   await this.create(email, bcryptedToken, tokenType);
  return otp;
}

  async create(
    email: string,
    hashedOTP: string,
    type: TokenType,
  ): Promise<Token> {
 const token =  await this.tokenModel.create({
      email: email,
      type: type,
      hash: hashedOTP,
      expiry: new Date(Date.now() + 60 * 60 * 1000),
    });
    return token
  }

async verify(otp: string, hash: string): Promise<boolean> {
  console.log(otp,hash)
  return await bcrypt.compare(otp, hash);
}

}
