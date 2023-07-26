import { IUser } from '../../types/types'

export default function CreateUserResponse(
  user: IUser
): Omit<IUser, 'password' | 'refreshToken' | 'googleId'> {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    coverPicture: user.coverPicture,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
    isVerified: user.isVerified,
    provider: user.provider,
    isLogged: user.isLogged,
  }
}
