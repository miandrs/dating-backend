import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatePlansModule } from './date-plans/date-plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatePlansModule,
  ],
})
export class AppModule {}
