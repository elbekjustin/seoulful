import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenAIService {
  private readonly apiKey = process.env.OPENAI_API_KEY;

  async createEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: texts,
        model: 'text-embedding-ada-002',
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
    );

    return response.data.data.map((item: any) => item.embedding);
  }
}
