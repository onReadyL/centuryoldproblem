import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // 重定向到login
  },
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }) => {
      console.log('authorized', auth, nextUrl);
      const isLoggedIn = !!auth?.user;
      const isOnLoginOrRegister =
        nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
      if (isOnLoginOrRegister) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
