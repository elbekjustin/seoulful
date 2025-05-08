import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { OpenAIModule } from '../openai/openai.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Property } from '../../libs/dto/property/property';
import PropertySchema from '../../schemas/Property.model';

@Module({
  imports: [OpenAIModule, MongooseModule.forFeature([{ name: Property.name, schema: PropertySchema }])],
  providers: [EmbeddingService],
  exports: [EmbeddingService],
})
export class EmbeddingModule {}
