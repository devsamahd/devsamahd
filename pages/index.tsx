import Header from '../components/Header'
import Meta from '../components/Head'
import ProjectSection from '../components/ProjectSection'
import { Container } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { SanityClient } from '../lib/sanity'
import BlogSection from '../components/BlogSection'

export default function Home({data, blog}:{data:any[], blog: any[]}) {
  return (
    <>
      <Meta />
      <main>
        <Container maxW={'7xl'}>
        <Header />
        <ProjectSection data={data} />
        <BlogSection blog={blog} />
        </Container>
      </main>
    </>
  )
}

export const getStaticProps:GetStaticProps = async() => {
  const blog = await SanityClient.fetch('*[_type == "post"]')
  const data = await SanityClient.fetch('*[_type == "projects"]{..., tags[]->}')
  
  return {props: {data, blog}}
}
