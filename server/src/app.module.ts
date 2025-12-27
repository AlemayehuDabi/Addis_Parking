import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from 'lib/auth';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AuthenticationModule } from './auth/auth.module';
import { ParkingModule } from './parking/parking.module';

@Module({
  imports: [
    AuthModule.forRoot({auth}),
    AuthenticationModule,
    ParkingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
