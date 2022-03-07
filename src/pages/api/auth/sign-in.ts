import argon2 from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';

import { FailureResponse, SuccessResponse } from '@/common/helper/apiResponse';
import { client } from '@/common/libs/sanity';

import { getUserByEmailQuery } from '@/modules/next-auth-sanity/queries';

export default async function signInHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return FailureResponse(res, 405, 'Method not allowed');
  }

  const { email, password } = req.body;

  if (!email) {
    return FailureResponse(res, 400, 'No email provided');
  }

  if (!password) {
    return FailureResponse(res, 400, 'No password provided');
  }

  const user = await client.fetch(getUserByEmailQuery, {
    email,
  });

  if (!user) {
    return FailureResponse(res, 404, 'User does not exist');
  }

  if (!(await argon2.verify(user.password, password))) {
    return FailureResponse(res, 401, 'Password Invalid');
  }

  return SuccessResponse(res, 200, {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  });
}
