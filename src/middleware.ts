export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/((?!api|sign-in|_next/static|_next/image|images|favicon.ico).*)'],
}
