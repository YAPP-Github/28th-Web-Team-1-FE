import { Theme } from '@radix-ui/themes'
import { MSWInitializer } from './MSWInitializer'
import { QueryProvider } from './QueryProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MSWInitializer />
      <Theme>
        <QueryProvider>{children}</QueryProvider>
      </Theme>
    </>
  )
}
