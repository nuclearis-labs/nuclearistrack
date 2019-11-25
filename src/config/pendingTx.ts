import txModel from '../models/transaction';
import { Document, Aggregate } from 'mongoose';

export async function sync(array: string[],subject:string) {
  await txModel.deleteMany({ data: { $in: array } });

  return await txModel.aggregate([
    {
      $match: {
        subject:subject
      }
    },
    {
      $group: {
        _id: null,
        result: { $push: { $arrayElemAt: ['$data', 2] } }
      }
    }
  ]);
}

export async function create({
  txHash,
  subject,
  data
}: {
  txHash: string;
  subject: string;
  data: string[];
}): Promise<Document> {
  return await txModel.create({
    txHash,
    subject: subject,
    data
  });
}
