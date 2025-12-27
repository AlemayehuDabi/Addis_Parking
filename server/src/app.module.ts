import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from 'lib/auth';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AuthenticationModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule.forRoot({auth}),
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
