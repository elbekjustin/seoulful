import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardArticleModule } from './board-article.module';

@Injectable()
export class BoardArticleService {
    constructor(@InjectModel('BoardArticle') private readonly boardArticleModel:Model<BoardArticleModule>) {}
}
