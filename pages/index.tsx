import Head from 'next/head'
import Header from '../components/Header'

export default function Home() {
  return (
    <>
      <Head>
        <title>AO Abdulsalam | DevSamahd</title>
        <meta name="description" content="Abdulsalam Abdulsamad, professional software developer with a knack for creating effective and efficient software solutions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/me.svg" />
      </Head>
      <main>
        <Header />
      </main>
    </>
  )
}
