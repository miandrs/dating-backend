import { Module } from '@nestjs/common';
import { DatePlansController } from './date-plans.controller';
import { DatePlansService } from './date-plans.service';
import { MongoConfigService } from './mongo-config.service';

@Module({
  controllers: [DatePlansController],
  providers: [DatePlansService, MongoConfigService],
  exports: [DatePlansService],
})
export class DatePlansModule {}
