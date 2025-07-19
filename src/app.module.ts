import { Module } from '@nestjs/common';
import { CheckoutModule } from './checkout/checkout.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { DatabaseModule } from './db/db.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    CheckoutModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
