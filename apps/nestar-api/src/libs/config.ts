import { ObjectId } from 'bson';

export const shapeIntoMongoObjectid = (target: any) => {
    return typeof target === 'string' ? new ObjectId(target) : target;
}