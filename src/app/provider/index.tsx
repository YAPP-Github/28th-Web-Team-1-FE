import { GoogleOAuthProvider } from './GoogleOAuthProvider'
import { MSWInitializer } from './MSWInitializer'
import { QueryProvider } from './QueryProvider'
import { Theme } from '@radix-ui/themes'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Theme>
      <GoogleOAuthProvider>
        <MSWInitializer />
        <QueryProvider>{children}</QueryProvider>
      </GoogleOAuthProvider>
    </Theme>
  )
}
