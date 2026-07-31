import localFont from 'next/font/local'
import '../style/globals.css'
import { Providers } from '../provider'
import { organizationJsonLd } from './metadata'

const pretendard = localFont({
  src: [
    {
      path: '../../../public/font/Pretendard-Regular.subset.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../../public/font/Pretendard-SemiBold.subset.woff2',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../../../public/font/Pretendard-Bold.subset.woff2',
      weight: '700',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-pretendard'
})

const elmsSans = localFont({
  src: '../../../public/font/ElmsSans-Bold.woff2',
  weight: '700',
  style: 'normal',
  display: 'swap',
  variable: '--font-elms'
})

export const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="ko" className={`${pretendard.className} ${pretendard.variable} ${elmsSans.variable} h-full antialiased`}>
      <body className="flex h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export { metadata, viewport } from './metadata'
