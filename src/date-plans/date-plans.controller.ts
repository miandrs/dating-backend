import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { DatePlansService } from './date-plans.service';
import { DatePlanRecord, MongoResult } from './date-plans.types';

interface CreatePlanDto {
  activity: string;
  date: string;
  time: string;
  location: string;
  message: string;
}

@Controller('date-plans')
export class DatePlansController {
  private readonly logger = new Logger(DatePlansController.name);

  constructor(private readonly datePlansService: DatePlansService) {}

  @Get()
  async findAll(): Promise<{ configured: boolean; plans: DatePlanRecord[] }> {
    if (!this.datePlansService.isConfigured()) {
      return { configured: false, plans: [] };
    }
    const plans = await this.datePlansService.findAll();
    return { configured: true, plans };
  }

  @Post()
  async create(@Body() body: CreatePlanDto): Promise<{ configured: boolean; result?: MongoResult }> {
    if (!this.datePlansService.isConfigured()) {
      this.logger.warn('Save attempted but MongoDB is not configured');
      return { configured: false };
    }
    const result = await this.datePlansService.create({
      activity: body.activity,
      date: body.date,
      time: body.time,
      location: body.location,
      message: (body.message ?? '').trim(),
    });
    this.logger.log(`Saved date plan: ${body.activity} on ${body.date}`);
    return { configured: true, result };
  }
}
