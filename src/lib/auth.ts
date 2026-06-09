import NextAuth, { DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & { role?: string; id?: string }
  }
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@elevenstarsfc.co.ke'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'ElevenStars2026!'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        if (!email || !password) return null

        // Admin login
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          return { id: 'admin', name: 'Admin', email: ADMIN_EMAIL, role: 'admin' }
        }

        // User login
        try {
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) return null
          const valid = await bcrypt.compare(password, user.password)
          if (!valid) return null
          return { id: user.id, name: user.name, email: user.email, role: 'user' }
        } catch {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? 'user'
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.id = token.userId as string
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET ?? 'elevenstars-dev-secret-change-in-production',
})
