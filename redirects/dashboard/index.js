// Librarys
import { getSession } from 'next-auth/react'

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (session === null) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      }
    }
  }

  const { user } = session;

  return {
    props: {
      user: {
        _id: user._id,
        role: user.role,
        email: user.email,
        fullname: user.fullname,
        secretKey: user.secretKey,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
        token: user.access_token,
      }
    }
  }
}
