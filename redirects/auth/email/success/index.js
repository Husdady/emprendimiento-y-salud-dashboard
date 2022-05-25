// Librarys
import { getSession } from 'next-auth/react'

// API
import { verifyUserAccount } from '@api/auth'

// Utils
import { isEmail } from '@utils/Validations'

export const getServerSideProps = async (ctx) => {
  // Obtener queries
  const { email, accountType, confirmationCode } = ctx.query

  // Validar 'email' y 'accountType' queries
	const isValidEmailQuery = isEmail(email)
	const isValidAccountType = ['admin', 'user'].includes(accountType)
  
  // Comprobar si la cuenta del usuario ya ha sido verificado
  const userAccountAlreadyVerified = await verifyUserAccount({
    email: email,
    accountType: accountType,
    confirmationCode: confirmationCode,
  })

  // Necesita redireccionar al inicio de sesión
  const needRedirectToLogin = [isValidEmailQuery, isValidAccountType, userAccountAlreadyVerified].includes(false)

	if (needRedirectToLogin) {
		return {
			redirect: {
        destination: '/auth/login',
        permanent: false,
      }
		}
	}

  return {
    props: {}
  }
}