import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          })
          const json = await res.json()
          if (!res.ok || json.error) return null
          return {
            id: json.data.user.id,
            email: json.data.user.email,
            name: json.data.user.name,
            role: json.data.user.role,
            accessToken: json.data.accessToken
          }
        } catch {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.accessToken = (user as any).accessToken
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      session.user.accessToken = token.accessToken as string
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
}
