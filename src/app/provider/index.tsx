import { GoogleOAuthProvider } from './GoogleOAuthProvider'
import { MSWInitializer } from './MSWInitializer'
import { QueryProvider } from './QueryProvider'
import { Theme } from '@radix-ui/themes'
import { Toast } from '@shared/ui/toast'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Theme>
      <GoogleOAuthProvider>
        <MSWInitializer />
        <Toast />
        <QueryProvider>{children}</QueryProvider>
      </GoogleOAuthProvider>
    </Theme>
  )
}
