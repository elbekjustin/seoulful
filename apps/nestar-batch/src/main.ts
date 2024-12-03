import { NestFactory } from '@nestjs/core';
import { NestarBatchModule } from './nestar-batch.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(NestarBatchModule);
	app.useGlobalPipes( new ValidationPipe());
	await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
