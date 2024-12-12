import { sendEmail } from './send-mail'
import { completeEmployeeRegistration } from './templates/complete-employee-registration'
import { forgotPasswordTemplate } from './templates/forgot-password'

import { welcomeTemplate } from './templates/welcome-template'

export async function sendEmailCompleteEmployeeRegistration(
  id: number,
  email: string,
): Promise<void> {
  const APP_FRONT_URL = process.env.FRONT_APP_URL

  const url = `${APP_FRONT_URL}/colaboradores/cadastro-completo?collaboratorId=${id}`

  const html = completeEmployeeRegistration(url)

  await sendEmail(email, 'Informações: Colaboradores ABC', html)
}

export async function sendEmailWelcomeUser(
  email: string,
  token: string,
): Promise<void> {
  const APP_FRONT_URL = process.env.FRONT_APP_URL

  const forgotLink = `${APP_FRONT_URL}/nova-senha?token=${token}`

  const html = welcomeTemplate(forgotLink)

  await sendEmail(email, 'ABC | Seja Bem-vindo ao ERP!', html)
}

export async function sendEmailForgotPassword(
  email: string,
  token: string,
): Promise<void> {
  const APP_FRONT_URL = process.env.FRONT_APP_URL

  const forgotLink = `${APP_FRONT_URL}/nova-senha?token=${token}`

  const html = forgotPasswordTemplate(forgotLink)

  await sendEmail(email, 'ABC | Pedido de Redefinição de Senha', html)
}
