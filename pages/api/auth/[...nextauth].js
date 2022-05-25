// Librarys
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// API
import { PUBLIC_URL, SECRET_PASSWORD } from '@api/credentials'

// Providers
const providers = [
  CredentialsProvider({
    name: 'Credentials',
    authorize: (credentials) => ({
      ...credentials,
      profilePhoto: JSON.parse(credentials.profilePhoto),
    }),
  }),
]

// Session
const callbacks = {
  jwt: async ({ token, user }) => {
    // Comprobar si existe un usuario
    if (user) {
      token.user = user
    }

    return Promise.resolve(token);
  },
  session: async ({ session, token }) => {
    const accessToken = {...token}

    delete accessToken.user
    delete accessToken.email

    session.user = token.user
    session.accessToken = accessToken
    session.error = token.error

    return Promise.resolve(session)
  },
}

export const options = {
  pages: {},
  providers: providers,
  callbacks: callbacks,
  secret: SECRET_PASSWORD,
  site: PUBLIC_URL,
}

const Auth = (req, res) => NextAuth(req, res, options)
export default Auth
