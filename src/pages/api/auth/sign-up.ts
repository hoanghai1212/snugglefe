import { uuid } from '@sanity/uuid';
import argon2 from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';

import { FailureResponse, SuccessResponse } from '@/common/helper/apiResponse';
import { client } from '@/common/libs/sanity';

import { SignUpData, SignUpResponse } from '@/modules/next-auth-sanity/client';
import { getUserByEmailQuery } from '@/modules/next-auth-sanity/queries';

export default async function signUpHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return FailureResponse(res, 405, 'Method not allowed');
  }

  const { email, password, name, image }: SignUpData = req.body;

  const user = await client.fetch(getUserByEmailQuery, {
    email,
  });

  if (user) {
    return FailureResponse(res, 409, 'Email already exist');
  }

  const newUser = await client.create({
    _id: `user.${uuid()}`,
    _type: 'user',
    email,
    password: await argon2.hash(password),
    name,
    image,
  });

  return SuccessResponse<SignUpResponse>(res, 200, {
    id: newUser._id,
    email: newUser.email,
    name: newUser.name,
    image: newUser.image,
  });
}
