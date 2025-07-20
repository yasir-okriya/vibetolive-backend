import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../../config";
import { createToken } from "./user.authUtils";
import { IUser, TLogin } from "./user.interface";
import { User } from "./user.model";
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createUserIntoDB = async (payload: Partial<IUser>) => {
    const newUser = await User.create(payload);

    const userObject: IUser = newUser.toObject();

    const jwtPayload = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username || "",
        is_staff: newUser.is_staff || false,
        is_superuser: newUser.is_superuser || false,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    )

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_refresh_expires_in as string,
    )

    const { password, ...result } = userObject;

    const returnResult = {
        accessToken,
        refreshToken,
        result
    }

    return returnResult;

};
