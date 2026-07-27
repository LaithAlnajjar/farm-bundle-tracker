import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './infrastructure/database/drizzle/drizzle.module';
import { AuthModule } from './modules/auth/auth.module';
import { FarmsModule } from './modules/farms/farms.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogsModule } from './modules/catalogs/catalogs.module';

@Module({
  imports: [
    DrizzleModule,
    UsersModule,
    AuthModule,
    CatalogsModule,
    FarmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
