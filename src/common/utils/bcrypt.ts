import * as bcrypt from 'bcrypt'

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)

  return {
    hashPassword,
  }
}

export async function comparePassword(password: string, hashedPassword: string) {
  const match = await bcrypt.compare(password, hashedPassword)

  return {
    isMatch: match,
  }
}
