export interface DatePlanRecord {
  activity: string;
  date: string;
  time: string;
  location: string;
  message: string;
  createdAt: string;
}

export interface MongoResult {
  insertedId?: string;
  insertedIds?: string[];
}
