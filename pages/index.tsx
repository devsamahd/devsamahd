import Header from '../components/Header'
import Meta from '../components/Head'
import ProjectSection, { SectionNumber } from '../components/ProjectSection'
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
            <div className="col-md-1" >
              
            </div>

            <div className="col-md-10">
              <Header />
              <ProjectSection data={data} /><br /><br />
              <BlogSection blog={blog} /><br /><br />


              
              <div className="row">
                <SectionNumber number={5} title={`Arsenal`} />
                <div className="col-md-6"><Tags heading='Skills' tags={["Web Development", "Front-End Development", "Back-End Development", "Web2+Web3","UI design", "Agile Methodologies","Mobile Development","Database management"]} /></div>
                <div className="col-md-6"><Tags heading='Tools' tags={["JavaScript","ReactJS","NextJS", "Redux+Toolkit","NodeJS","ExpressJS", "MongoDB","PHP","MySQL","SQL","React Native","CSS/SASS","Bootstrap","Chakra UI","VSCode","XAMPP"]} /></div>
              </div><br />
              

              <NewsLetter />
            </div>

            <div className="col-md-1">
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
                "margin": "20px auto",
                "fontFamily":"monospace",
                fontWeight:"600"
              }}
              _hover={{
                paddingBottom:"30px"
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
