import Header from '../components/Header'
import Meta from '../components/Head'
import ProjectSection from '../components/ProjectSection'
import { Container, useColorModeValue } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { SanityClient } from '../lib/sanity'
import BlogSection from '../components/BlogSection'
import Tags from '../components/Tags'
import NewsLetter from '../components/NewsLetter'

export default function Home({data, blog}:{data:any[], blog: any[]}) {
  console.log(blog)
  return (
    <>
      <Meta />
      <main>
        <Container maxW={'7xl'}>
          <div className="row">
            <style jsx>
              {`
              .headerone{
                position: sticky !important;
                bottom: 0;
                margin: 0;
                padding: 0;
                overflow: auto;
                border-left: 1px solid ${useColorModeValue("#1A202C", "#FFFFFFEB")};
                border-right: 1px solid ${useColorModeValue("#1A202C", "#FFFFFFEB")};
                
              }
              .borderLeft{
                border-left: 1px solid ${useColorModeValue("#1A202C", "#FFFFFFEB")};
              }
              `}
            </style>

            <div className="col-md-3 headerone">
              <Header />
            </div>

            <div className="col-md-7">
              <ProjectSection data={data} /><br /><br />
              <BlogSection blog={blog} /><br /><br />
              <NewsLetter />
            </div>

            <div className="col-md-2 borderLeft">
              <Tags heading='Skills' tags={["Web Development", "Front-End Development", "Back-End Development", "Web2+Web3","UI design", "Agile Methodologies","Mobile Development","Database management"]} />
              <Tags heading='Tools' tags={["JavaScript","ReactJS","NextJS", "Redux+Toolkit","NodeJS","ExpressJS", "MongoDB","PHP","MySQL","SQL","React Native","CSS/SASS","Bootstrap","Chakra UI","VSCode","XAMPP"]} />
            </div>

          </div>
        
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
