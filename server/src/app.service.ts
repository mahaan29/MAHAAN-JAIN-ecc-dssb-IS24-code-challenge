import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // API for api/health endpoint
  health() {
    return {
      status: 'OK',
    };
  }
}
