import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, Document, MongoClient, Sort } from 'mongodb';
import { DatePlanRecord, MongoResult } from './date-plans.types';

@Injectable()
export class MongoConfigService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoConfigService.name);
  private readonly uri: string;
  private readonly dbName: string;
  private readonly collectionName: string;
  private client?: MongoClient;
  private col?: Collection<Document>;

  constructor(private config: ConfigService) {
    this.uri = this.config.get<string>('MONGODB_URI') ?? '';
    this.dbName = this.config.get<string>('MONGO_DB') ?? '';
    this.collectionName = this.config.get<string>('MONGO_COLLECTION') ?? '';
  }

  async onModuleInit() {
    if (!this.isConfigured()) {
      this.logger.warn(
        'MongoDB is NOT fully configured — set MONGODB_URI, MONGO_DB, MONGO_COLLECTION in server/.env',
      );
      return;
    }
    try {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.col = this.client.db(this.dbName).collection(this.collectionName);
      this.logger.log('MongoDB connected');
    } catch (err) {
      this.logger.error('MongoDB connection failed', err as Error);
    }
  }

  async onModuleDestroy() {
    await this.client?.close();
  }

  isConfigured(): boolean {
    return Boolean(this.uri && this.dbName && this.collectionName);
  }

  private getCol(): Collection<Document> {
    if (!this.col) throw new Error('MongoDB is not connected');
    return this.col;
  }

  async insertOne(document: DatePlanRecord): Promise<MongoResult> {
    const res = await this.getCol().insertOne({ ...document });
    return { insertedId: res.insertedId.toString() } as MongoResult;
  }

  async find(
    filter: Record<string, unknown> = {},
    sort: Sort = { createdAt: -1 },
    limit = 50,
  ): Promise<DatePlanRecord[]> {
    const docs = await this.getCol().find(filter).sort(sort).limit(limit).toArray();
    return docs as unknown as DatePlanRecord[];
  }
}