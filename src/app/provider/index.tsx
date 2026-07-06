import { GoogleOAuthProvider } from './GoogleOAuthProvider'
import { MSWInitializer } from './MSWInitializer'
import { QueryProvider } from './QueryProvider'
import { Theme } from '@radix-ui/themes'
import { Toast } from '@shared/ui/toast'
import { TooltipProvider } from '@shared/ui/tooltip'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Theme>
      <TooltipProvider>
        <GoogleOAuthProvider>
          <MSWInitializer />
          <Toast />
          <QueryProvider>{children}</QueryProvider>
        </GoogleOAuthProvider>
      </TooltipProvider>
    </Theme>
  )
}
