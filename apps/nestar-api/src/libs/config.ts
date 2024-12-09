import { ObjectId } from 'bson';

export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLike', 'memberViews', 'memberRank'];
export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLike', 'memberViews'];

export const shapeIntoMongoObjectid = (target: any) => {
    return typeof target === 'string' ? new ObjectId(target) : target;
}