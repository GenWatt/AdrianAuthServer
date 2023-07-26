export default function CreateConfirmationEmailBody(
  confirmationToken: string
): string {
  return `
        <h1 style="margin-bottom: 5px">Confirm your e-mail - <strong style="color: #1bc449;">AdrianAuth</strong></h1>
        <a href="${process.env.BASE_URL}/confirm/${confirmationToken}">Click here to confirm your e-mail</a>
    `
}
