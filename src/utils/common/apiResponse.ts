import { HttpStatus } from '@nestjs/common';

export class APIResponse {
  constructor(
    public error: boolean,
    public message: string,
    public data: any = null,
    public status: HttpStatus,
  ) {}

  static conflict(message: string = 'Conflict', data: any = null): APIResponse {
    return new APIResponse(true, message, data, HttpStatus.CONFLICT);
  }

  static success(data: any = null, message: string = 'Success'): APIResponse {
    return new APIResponse(false, message, data, HttpStatus.OK);
  }

  static notFound(message: string = 'Not Found', data: any = null): APIResponse {
    return new APIResponse(true, message, data, HttpStatus.NOT_FOUND);
  }

  static unauthorized(message: string = 'Unauthorized', data: any = null): APIResponse {
    return new APIResponse(true, message, data, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message: string = 'Forbidden', data: any = null): APIResponse {
    return new APIResponse(true, message, data, HttpStatus.FORBIDDEN);
  }

  static internalServerError(message: string = 'Internal Server Error', data: any = null): APIResponse {
    return new APIResponse(true, message, data, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
