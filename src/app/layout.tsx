import '../../css/globals.css'
// import '../../css/index.css'
// import '../../css/home.css'
// import '../../css/sidenav.css'
import '../../css/styles1.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import {config} from '@fortawesome/fontawesome-svg-core'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

config.autoAddCss=false

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
