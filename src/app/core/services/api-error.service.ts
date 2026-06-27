import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiErrorResponse, FieldError } from '../models/api.model';

const DEFAULT_MESSAGES: Record<number, string> = {
  0: 'Unable to reach the server. Check your connection.',
  400: 'The request could not be processed.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with existing data.',
  422: 'Please correct the highlighted fields.',
  500: 'Something went wrong on our end. Please try again.',
};

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  getMessage(error: HttpErrorResponse): string {
    const body = error.error as ApiErrorResponse | undefined;
    if (body?.message) {
      return body.message;
    }

    return DEFAULT_MESSAGES[error.status] ?? DEFAULT_MESSAGES[500];
  }

  getFieldErrors(error: HttpErrorResponse): FieldError[] {
    const body = error.error as ApiErrorResponse | undefined;
    return body?.errors ?? [];
  }

  isValidationError(error: HttpErrorResponse): boolean {
    return error.status === 422 || (this.getFieldErrors(error).length > 0 && error.status === 400);
  }

  isUnauthorized(error: HttpErrorResponse): boolean {
    return error.status === 401;
  }

  isForbidden(error: HttpErrorResponse): boolean {
    return error.status === 403;
  }

  isNotFound(error: HttpErrorResponse): boolean {
    return error.status === 404;
  }
}
