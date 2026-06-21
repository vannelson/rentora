import type { User } from '../types';

export async function signInWithEmail(email: string, _password: string): Promise<User> {
  await delay(600);
  return makeMockUser(email);
}

export async function signUpWithEmail(
  email: string,
  _password: string,
  fullName: string
): Promise<User> {
  await delay(800);
  return makeMockUser(email, fullName);
}

export async function signOut(): Promise<void> {
  await delay(200);
}

export async function resetPassword(_email: string): Promise<void> {
  await delay(500);
}

export async function fetchProfile(_userId: string): Promise<User> {
  await delay(200);
  return makeMockUser('demo@rentora.app', 'Demo User');
}

function makeMockUser(email: string, fullName?: string): User {
  const name = fullName ?? email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: 'mock-user',
    email,
    full_name: name,
    avatar_url: undefined,
    phone: undefined,
    created_at: new Date().toISOString(),
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
