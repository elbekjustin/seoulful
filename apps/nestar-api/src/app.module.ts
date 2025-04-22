import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { SocketModule } from './socket/socket.module';
import { NotificationModule } from './components/notification/notification.module';
@Module({
	imports: [
		ConfigModule.forRoot(), //.env done
		GraphQLModule.forRoot({ // Rest API => GraphQL API
			driver: ApolloDriver, // Apollo GraphQL serveri uchun driver/kutubxona
			playground: true,
			uploads: false,
			debug: true, // Debug ma'lumotlar
			autoSchemaFile: true,
      formatError: (error: T) => { // GraphQL error global handling
        const graphQLFormattedError = {
          code: error?.extensions.code,
          message:
            error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
        };
        console.log('GRAPHQL GLOBAL ERROR:', graphQLFormattedError);
        return graphQLFormattedError
      },
		}),
		ComponentsModule,
		DatabaseModule,
		SocketModule,
		NotificationModule,
	],
	controllers: [AppController],
	providers: [AppService, AppResolver],
})
export class AppModule {}
