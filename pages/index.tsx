import Header from '../components/Header'
import Meta from '../components/Head'
import { Box, Container, Stack, Text} from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { SanityClient } from '../lib/sanity'
import BlogSection from '../components/BlogSection'
import NewsLetter from '../components/NewsLetter'
import useMousePosition from '../context/useMousePos'
import About from '../components/About'
import ProjectSection from '../components/ProjectSection'
// import Experience from '../components/Experience'

export default function Home({data, blog}:{data:any[], blog: any[]}) {  
  
  const {x,y} = useMousePosition()
  return (
    <>
      <Meta />
      <main>
        <Container maxW={'7xl'}>
          <div className="row">
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
              {x}
              <Text
              align={"center"}
              p={"10px"}
              style={{
                "writingMode": "vertical-rl",
                "display":"inline-block",
                "marginBottom": "20px",
                "fontFamily":"monospace",
                fontWeight:"600"

              }}
              _hover={{
                paddingBottom:"30px",
              }}
              >
                {y}
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
              <Header /><br /><br />
              <About /><br /><br /><br />  
              {/* <Experience /> */}
              <ProjectSection data={data} /><br /><br /><br />
              <BlogSection blog={blog} /><br /><br /><br />


              {/* <div className="row">
                <SectionNumber number={4} title={`Arsenal`} />
                <div className="col-md-6"><Tags heading='Skills' tags={["Web Development", "Front-End Development", "Back-End Development", "Web2+Web3","UI design", "Agile Methodologies","Mobile Development","Database management"]} /></div>
                <div className="col-md-6"><Tags heading='Tools' tags={["JavaScript","ReactJS","NextJS", "Redux+Toolkit","NodeJS","ExpressJS", "MongoDB","PHP","MySQL","SQL","React Native","CSS/SASS","Bootstrap","Chakra UI","VSCode","XAMPP"]} /></div>
              </div><br /> */}
              

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
                paddingBottom:"30px",
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
  let data, blog
  try{
  blog = await SanityClient.fetch('*[_type == "post"]')
  data = await SanityClient.fetch('*[_type == "projects"]{..., tags[]->}')
  }catch(err){
    console.log(err)
  }finally{
    if(!data || !blog){
      data = []
      blog= []
    }
  }
  return {props: {data, blog}}
}