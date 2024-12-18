import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress} from "graphql-upload"
import * as express from 'express'

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new LoggingInterceptor()); // loglash
	app.enableCors({ origin: true, credentials: true }); // ixtiyoriy requestni qabul qilishga imkon

	app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 })); // limit 15MG
	app.use('/uploads', express.static('./uploads')); // tashqi olamga ochdik, static qildik

	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
