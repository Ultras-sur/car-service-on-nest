import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WorkPost, WorkPostDocument } from '../../schemas/workpost.schema';
import { CreateWorkPostDTO } from '../../dto/create-workpost.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';

@Injectable()
export class WorkPostService {
  constructor(@InjectModel(WorkPost.name) private workPostModel: Model<WorkPostDocument>) { }

  async createWorkPost() {
    const createdWorkPost = new this.workPostModel({ number: 'queue' });
    return createdWorkPost.save();
  }

  async getWorkPosts(): Promise<WorkPost[]> {
    const workPosts = await this.workPostModel.find().exec();
    return workPosts;
  }

  async setToWorkPost(order) {
    console.log(order.workPost, order.car, order._id)
    const setedWorkPost = await this.workPostModel.findOneAndUpdate({ number: order.workPost }, { car: order.car, order: order._id });
    return setedWorkPost;
  }

  async unsetWorkPost(workpostNumber): Promise<any> {
    //console.log(order.workPost, order.car, order._id)
    const unSetedWorkPost = await this.workPostModel.findOneAndReplace({ number: workpostNumber }, { number: workpostNumber });
    return unSetedWorkPost;
  }
}
