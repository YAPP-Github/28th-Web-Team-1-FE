import { MSWInitializer } from './MSWInitializer'
import { QueryProvider } from './QueryProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MSWInitializer />
      <QueryProvider>{children}</QueryProvider>
    </>
  )
}
