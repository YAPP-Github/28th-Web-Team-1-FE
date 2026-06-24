import { GoogleOAuthProvider } from './GoogleOAuthProvider'
import { MSWInitializer } from './MSWInitializer'
import { QueryProvider } from './QueryProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider>
      <MSWInitializer />
      <QueryProvider>{children}</QueryProvider>
    </GoogleOAuthProvider>
  )
}
