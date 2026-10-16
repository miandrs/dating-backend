import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoConfigService } from './mongo-config.service';
import { DatePlanRecord, MongoResult } from './date-plans.types';

@Injectable()
export class DatePlansService {
  constructor(private readonly mongo: MongoConfigService) {}

  isConfigured(): boolean {
    return this.mongo.isConfigured();
  }

  async create(plan: Omit<DatePlanRecord, 'createdAt'>): Promise<MongoResult> {
    if (!this.mongo.isConfigured()) {
      throw new NotFoundException('MongoDB is not configured');
    }
    const record: DatePlanRecord = { ...plan, createdAt: new Date().toISOString() };
    return this.mongo.insertOne(record);
  }

  async findAll(): Promise<DatePlanRecord[]> {
    if (!this.mongo.isConfigured()) {
      return [];
    }
    return this.mongo.find();
  }
}
