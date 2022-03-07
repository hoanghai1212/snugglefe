import axios from 'axios';

// Sign Up
export interface SignUpData {
  email: string;
  password: string;
  name?: string;
  image?: string;
}

export interface SignUpResponse {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export const signUp = async (data: SignUpData) => {
  const res = await axios.post<SignUpResponse>('/api/auth/sign-up', {
    ...data,
  });

  return res.data;
};

// Sign In
export const signIn = async (data: SignUpData) => {
  const res = await axios.post<SignUpResponse>('/api/sanity/signUp', {
    ...data,
  });

  return res.data;
};
