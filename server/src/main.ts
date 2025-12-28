import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false
  });

  // light weight for iot
  app.useWebSocketAdapter(new WsAdapter(app));

  // app.setGlobalPrefix('api')

  // api integration
  app.enableCors({
    origin: ['http://localhost:8080', 'addis-parking.vercel.app'], // Your React app URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT}`);
}
bootstrap();
