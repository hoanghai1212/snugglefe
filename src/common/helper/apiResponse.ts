import { NextApiResponse } from 'next';
export const SuccessResponse = <T>(
  res: NextApiResponse,
  statusCode: number,
  data: T
) =>
  res.status(200).json({
    success: true,
    statusCode,
    data,
  });

export const FailureResponse = (
  res: NextApiResponse,
  statusCode: number,
  message?: string
) =>
  res.status(200).json({
    success: false,
    statusCode,
    message,
  });
