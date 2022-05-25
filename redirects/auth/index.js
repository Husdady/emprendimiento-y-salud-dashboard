// Librarys
import { getSession } from 'next-auth/react'

// API
import { verifyIfExistAdmin } from '@api/auth'

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

  // Comprobar si existe usuario administrador
  const existUserAdmin = await verifyIfExistAdmin()

  return {
    props: { existUserAdmin }
  }
}