import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google'

export const GoogleOAuthProvider = ({ children }: { children: React.ReactNode }) => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined')
  return <GoogleProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>{children}</GoogleProvider>
}
