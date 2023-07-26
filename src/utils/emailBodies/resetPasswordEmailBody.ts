function resetPasswordEmailBody(name: string, token: string, email: string) {
  return `
    <h1>Hi ${name}!</h1>
    <p>Looks like you forgot your password. No worries! Just click the link below to reset it.</p>
    <a href="${process.env.AUTH_CLIENT_URL}/new-password?token=${token}&email=${email}">Reset Password</a>
    <p>If you didn't request a password reset, please ignore this email.</p>
  `
}

export default resetPasswordEmailBody
