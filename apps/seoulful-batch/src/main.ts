import { NestFactory } from '@nestjs/core';
import { SeoulfulBatchModule } from './batch.module';

async function bootstrap() {
	const app = await NestFactory.create(SeoulfulBatchModule);
	await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
