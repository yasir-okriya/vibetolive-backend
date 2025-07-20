import jwt from 'jsonwebtoken';


export const createToken = (
  jwtPayload: { email: string; username: string, is_staff: boolean, is_superuser: boolean },
  secret: string,
  expiresIn: any,
) => {
  const token = jwt.sign(
    {
      email: jwtPayload.email,
      username: jwtPayload.username,
      is_staff: jwtPayload.is_staff,
      is_superuser: jwtPayload.is_superuser,
    },
    secret,
    { expiresIn: expiresIn }
  );

  return token;
};
