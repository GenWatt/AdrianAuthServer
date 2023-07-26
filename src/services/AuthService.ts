import { ILoginUser, IUser, UserBody } from '../types/types'
import User from '../models/User'
import ConfirmationToken from '../models/ConfirmationToken'
import nodeMailer from 'nodemailer'
import emailSender from '../utils/emailSender'
import CreateConfirmationEmailBody from '../utils/emailBodies/confirmationEmailBody'
import { injectable } from 'inversify'
import TokenService from './TokenService'
import services from '../inversify.config'
import HttpError from '../errors/HttpError'
import bycrypt from 'bcrypt'
import resetPasswordEmailBody from '../utils/emailBodies/resetPasswordEmailBody'
import AuthDatabase from '../db/AuthDatabase'
import { Response } from 'express'

@injectable()
class AuthService {
  private tokenService: TokenService = services.get<TokenService>(TokenService)
  private databaseService: AuthDatabase =
    services.container.resolve<AuthDatabase>(AuthDatabase)

  public async register(user: UserBody) {
    const { username, email, password } = user
    const confirmationToken = this.tokenService.createConfirmationToken(email)

    // save token in db
    const confirmationTokenModel = new ConfirmationToken({
      token: confirmationToken,
      email,
    })
    await confirmationTokenModel.save(this.databaseService.getSessionObject())

    const options: nodeMailer.SendMailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Confirm your email - AdrianAuth',
      html: CreateConfirmationEmailBody(confirmationToken),
    }

    const newUser = new User({
      username,
      email,
      password,
      provider: 'local',
    })

    await newUser.save(this.databaseService.getSessionObject())
    await emailSender.sendEmail(options)
  }

  public async login(loginUser: ILoginUser) {
    const { password, identifier } = loginUser
    const user = await User.findOne({
      $or: [
        { email: identifier, active: true },
        { username: identifier, active: true },
      ],
    })

    if (!user || user.provider !== 'local' || !user.password) {
      throw new HttpError(401, 'Invalid email or password')
    }

    const isMatch = await bycrypt.compare(password, user.password)

    if (!isMatch) {
      throw new HttpError(401, 'Invalid email or password')
    }

    const { accessToken, refreshToken } =
      this.tokenService.createAccessAndRefreshToken(user)

    // update user refresh token
    await User.updateOne({ _id: user._id }, { refreshToken, isLogged: true })

    return { accessToken, refreshToken, user }
  }

  public async newPassword(password: string, token: string) {
    const dbToken = await ConfirmationToken.findOne({ token })

    if (!dbToken) throw new HttpError(400, 'Invalid token')

    const result = this.tokenService.verifyResetToken(dbToken.token)

    if (!result) throw new HttpError(400, 'Invalid token')

    const user = await User.findOne({ email: result.email })

    if (!user) throw new HttpError(404, 'User not found')

    user.password = password

    await user.save(this.databaseService.getSessionObject())
    await ConfirmationToken.deleteOne(
      { token },
      this.databaseService.getSessionObject()
    )

    return user
  }

  public async resetPassword(email: string) {
    // check if email exists
    const user = await User.findOne({ email })

    if (!user) throw new HttpError(404, 'User not found')

    const resetToken = this.tokenService.createResetToken(email)

    // save token in db
    const confirmationTokenModel = new ConfirmationToken({
      token: resetToken,
      email,
    })
    await confirmationTokenModel.save()

    const options: nodeMailer.SendMailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset your password - AdrianAuth',
      html: resetPasswordEmailBody(user.username, resetToken, user.email),
    }

    await emailSender.sendEmail(options)
  }

  public async confirmEmail(token: string) {
    const confirmationToken = await ConfirmationToken.findOne({
      token,
    })

    if (!confirmationToken) {
      throw new HttpError(404, 'Token not found')
    }

    // check if token is expired
    const result = this.tokenService.verifyConfirmationToken(token)

    if (!result) {
      throw new HttpError(400, 'Token expired')
    }

    const user = await User.findOne({
      email: confirmationToken.email,
    })

    if (!user) throw new HttpError(400, 'User not found')

    await User.updateOne(
      { email: confirmationToken.email },
      { isVerified: true },
      this.databaseService.getSessionObject()
    )

    await ConfirmationToken.deleteOne(
      { token },
      this.databaseService.getSessionObject()
    )
  }

  public async logout(user: IUser, res: Response) {
    await User.updateOne({ _id: user._id }, { refreshToken: '' })
    res.clearCookie('access_token')
  }
}

export default AuthService
