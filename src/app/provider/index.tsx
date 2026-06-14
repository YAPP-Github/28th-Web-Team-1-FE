import { QueryProvider } from './QueryProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>
}
