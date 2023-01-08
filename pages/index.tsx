import Header from '../components/Header'
import Meta from '../components/Head'
import ProjectSection from '../components/ProjectSection'
import { Box, Container, Stack, Text} from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { SanityClient } from '../lib/sanity'
import BlogSection from '../components/BlogSection'
import Tags from '../components/Tags'
import NewsLetter from '../components/NewsLetter'

export default function Home({data, blog}:{data:any[], blog: any[]}) {
  return (
    <>
      <Meta />
      <main>
        <Container maxW={'7xl'}>
          <div className="row">
            <style jsx>
              {`
              
              `}
            </style>

            <div className="col-md-1" >
              <Box style={{
                "display":"flex",
                "flexDirection":"column",
                "position": "fixed",
                "zIndex":10,
                "bottom": 0,
            }}
            visibility={{base:"hidden", md:"visible"}}
            >
              <Text
              align={"center"}
              p={"10px"}
              style={{
                "writingMode": "vertical-rl",
                "display":"inline-block",
                "margin": "20px auto"
              }}
              >
                Devsamahd@gmail.com
              </Text>
              <Stack
              _after={{
                content: '""',
                display: "block",
                width: "1px",
                height: "90px",
                margin: "0px auto",
                background: "gray.700"
              }}
              ></Stack>
              </Box>
            </div>

            <div className="col-md-10">
              <Header />
              <ProjectSection data={data} /><br /><br />
              <BlogSection blog={blog} /><br /><br />
              <Tags heading='Skills' tags={["Web Development", "Front-End Development", "Back-End Development", "Web2+Web3","UI design", "Agile Methodologies","Mobile Development","Database management"]} />
              <Tags heading='Tools' tags={["JavaScript","ReactJS","NextJS", "Redux+Toolkit","NodeJS","ExpressJS", "MongoDB","PHP","MySQL","SQL","React Native","CSS/SASS","Bootstrap","Chakra UI","VSCode","XAMPP"]} />
              <NewsLetter />
            </div>

            <div className="col-md-1">
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
