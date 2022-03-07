import argon2 from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { FailureResponse, SuccessResponse } from '@/common/helper/apiResponse';
import { client } from '@/common/libs/sanity';

import { getVerificationRequestQuery } from '@/modules/next-auth-sanity/queries';

export default async function signUpHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { identifier, token } = req.body;

  switch (req.method) {
    case 'GET': {
      const verificationRequest = await client.fetch(
        getVerificationRequestQuery,
        {
          identifier,
        }
      );

      if (!verificationRequest) {
        return FailureResponse(res, 404, 'Token not found');
      }

      const checkToken = await argon2.verify(
        verificationRequest.token,
        `${token}`
      );

      if (!checkToken) {
        return FailureResponse(res, 401, 'Invalid token');
      }

      if (verificationRequest.expires < new Date()) {
        await client.delete(verificationRequest._id);

        return FailureResponse(res, 401, 'Token expired');
      }

      return SuccessResponse(res, 201, {
        id: verificationRequest._id,
        ...verificationRequest,
      });
    }

    case 'POST': {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      await client.create({
        _type: 'verification-request',
        identifier,
        token: await argon2.hash(token),
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });

      const mailOption: Mail.Options = {
        from: `${process.env.EMAIL}`,
        to: `${identifier}`,
        subject: `New mail from ${process.env.EMAIL}`,
        text: `Hello`,
        priority: 'high',
      };

      return transporter.sendMail(mailOption, (error, data) => {
        if (error) {
          return FailureResponse(res, 500, error.message);
        } else {
          return SuccessResponse(res, 200, data);
        }
      });
    }

    case 'DELETE': {
      const verificationRequest = await client.fetch(
        getVerificationRequestQuery,
        {
          identifier,
        }
      );

      if (!verificationRequest) {
        return FailureResponse(res, 404, 'Token not found');
      }

      const checkToken = await argon2.verify(verificationRequest.token, token);

      if (!checkToken) {
        return FailureResponse(res, 401, 'Invalid token');
      }

      await client.delete(verificationRequest._id);

      return SuccessResponse(res, 204, {
        message: 'Verification request deleted',
      });
    }
    default:
      return FailureResponse(res, 405, 'Method not allowed');
  }
}
