import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { WorkPost, WorkPostDocument } from '../../schemas/workpost.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class WorkPostService {
  constructor(
    @InjectModel(WorkPost.name) private workPostModel: Model<WorkPostDocument>,
  ) {}

  async createWorkPost(): Promise<WorkPost> {
    const createdWorkPost = new this.workPostModel({ number: 'queue' });
    return createdWorkPost.save();
  }

  async getWorkPosts(): Promise<WorkPost[]> {
    const workPosts = await this.workPostModel.find().exec();
    return workPosts;
  }

  async setToWorkPost(
    order,
    session: mongoose.ClientSession | null = null,
  ): Promise<WorkPost> {
    return this.workPostModel
      .findOneAndUpdate(
        { number: order.workPost },
        { car: order.car, order: order._id },
      )
      .session(session);
  }

  async unsetWorkPost(
    workpostNumber,
    session: mongoose.ClientSession | null = null,
  ): Promise<WorkPost> {
    return this.workPostModel
      .findOneAndReplace({ number: workpostNumber }, { number: workpostNumber })
      .session(session);
  }
}
