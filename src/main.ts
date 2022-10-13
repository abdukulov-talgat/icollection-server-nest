import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_PORT } from './common/constants/environment';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    await app.listen(APP_PORT, () => console.log(`APP STARTED ON PORT ${APP_PORT}`));
}

void bootstrap();
