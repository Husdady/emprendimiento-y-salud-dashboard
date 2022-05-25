// Librarys
import { getSession } from 'next-auth/react'

// API
import { verifyUserEmail } from '@api/auth'
import { sendEmailConfirmation } from '@api/auth'

// Utils
import { isEmail } from '@utils/Validations'

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  
  if (session !== null) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  const { email } = ctx.query
  const existUserEmail = await verifyUserEmail(email)

  if (!isEmail(email) || !existUserEmail) {
  	return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      }
    }
  }

  return {
    props: { email }
  }
}