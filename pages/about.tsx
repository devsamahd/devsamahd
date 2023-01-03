import { Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import Meta from '../components/Head'
import { SectionNumber } from '../components/ProjectSection'

const About = () => {
  
  return (
    <>
    <Meta />
    <div className="row">
      <div className="col-md-2"></div>
      <div className="col-md-9 container">
          <br />
          <SectionNumber where={true} number={1} />
          <br />
          <Heading>About me</Heading><br />
          <div className="row">
            <div className="col-md-9">
              <Text>
              Hey, I'm Samahd! I'm a software developer working from Nigeria. Welcome to my garden on the web for my projects, articles and anything else I want to show the world. Check out the <Link href={"/projects"}><u>projects</u></Link> page to see a highlight of my work, and the blog for my tutorials and more.
              </Text><br />
              <Text>
              My site has no ads, no affiliate links, no tracking or analytics, no sponsored posts, and no paywall. My only motivation for this site is to share what I've learned. I want to make the internet a better place just as many developers want to. Even if it's just right here. I hope I will inspire others to make their own creative corner on the web as well.
              </Text><br />
              <Text>
              You can contact me by email at <Link href={"mailto:devsamahd@gmail.com"}><u>Devsamahd@gmail.com</u></Link> to say hi! I always appreciate meeting new people.
              </Text>
              
            </div>
            <div className="col-md-3"></div>
          </div>
      </div>
      </div>
    </>
    
  )
}

export default About