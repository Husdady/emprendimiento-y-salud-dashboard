// Librarys
import { getSession } from 'next-auth/react'

// API
import { verifyPasswordConfirmationCode } from '@api/auth'

// Utils
import { isEmail } from '@utils/Validations'

export const getServerSideProps = async (ctx) => {
  // Obtener queries
  const { email, accountType, confirmationCode } = ctx.query

  // Validar 'email' y 'accountType' queries
	const isValidEmailQuery = isEmail(email)
	const isValidAccountType = ['admin', 'user'].includes(accountType)
  
  // Comprobar si aún es válida el código de confirmación para actualizar la contraseña de un usuario
  const isValidConfirmationCode = await verifyPasswordConfirmationCode({
    email: email,
    accountType: accountType,
    confirmationCode: confirmationCode,
  })

  // Necesita redireccionar al inicio de sesión
  const needRedirectToLogin = [isValidEmailQuery, isValidAccountType, isValidConfirmationCode].includes(false)

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