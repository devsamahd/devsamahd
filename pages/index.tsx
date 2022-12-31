import Header from '../components/Header'
import Meta from '../components/Head'
import ProjectSection from '../components/ProjectSection'
import { Container } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { SanityClient } from '../lib/sanity'

export default function Home({data}:{data:any[]}) {
  return (
    <>
      <Meta />
      <main>
        <Container maxW={'7xl'}>
        <Header />
        <ProjectSection data={data} />
        </Container>
      </main>
    </>
  )
}

export const getStaticProps:GetStaticProps = async() => {
  const data = await SanityClient.fetch('*[_type == "projects"]{..., tags[]->}')
  return {props: {data}}
}
