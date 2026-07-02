import { apiClient } from './client';
import type { ApiResponse, SignInPayload, SignInResponse, SignUpPayload } from '../types/api';
import { USER_ROLE_ID } from '../constants/roles';

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  const { data } = await apiClient.post<ApiResponse<SignInResponse>>('/auth/sign-in', payload);

  return data.data;
}

export async function signUp(
  payload: Omit<SignUpPayload, 'roles'>,
): Promise<void> {
  await apiClient.post<ApiResponse<unknown>>('/auth/signUp', {
    ...payload,
    roles: [USER_ROLE_ID],
  });
}
