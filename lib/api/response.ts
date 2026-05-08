import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export function successResponse<T>(data: T, status = 200) {
  const response: ApiResponse<T> = { data };
  return NextResponse.json(response, { status });
}

export function errorResponse(error: string, status = 400) {
  const response: ApiResponse<never> = { error };
  return NextResponse.json(response, { status });
}

export function createdResponse<T>(data: T) {
  return successResponse(data, 201);
}

export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401);
}

export function forbiddenResponse() {
  return errorResponse('Forbidden', 403);
}

export function notFoundResponse() {
  return errorResponse('Not found', 404);
}

export function internalErrorResponse() {
  return errorResponse('Internal server error', 500);
}
