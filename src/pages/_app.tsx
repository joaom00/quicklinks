import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { NextSeo } from 'next-seo'
import Head from 'next/head'

const title = 'QuickLinks'
const description = 'Just a component around the Cmdk and Radix Popover for you just copy'
const siteUrl = 'https://quicklinks-weld.vercel.app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <NextSeo
        title={`${description} - ${title}`}
        description={description}
        openGraph={{
          type: 'website',
          url: siteUrl,
          title,
          description: description + '.',
          images: [
            {
              url: `${siteUrl}/og.png`,
              alt: title,
            },
          ],
        }}
      />

      <Component {...pageProps} />
    </>
  )
}
