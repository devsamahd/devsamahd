import { ExternalLinkIcon, MinusIcon } from '@chakra-ui/icons'
import { Heading, Text, Link, List, ListItem} from '@chakra-ui/react'
import React from 'react'
import Meta from '../components/Head'

const About = () => {
  
  return (
    <>
    <Meta />
    <div className="row pt-5 container">
      <div className="col-md-2"></div>
      <div className="col-md-9 pt-5 container">
          <br />
          <br />
          <Heading>Abdulsalam Abdulsamad</Heading>
          <Heading size={"md"} fontWeight={500}><i>Software Developer Extra-Ordinaire</i></Heading>
          <br />
          <div className="row">
            <div className="col-md-9">
              <Text>
              Hey, I'm Samahd! I'm a software developer working from Nigeria. Welcome to my digital garden for my portfolio, projects, articles and anything else I want to show the world. Check out the <Link href={"/projects"}><u>projects</u></Link> page to see a highlight of my work, and the blog for my tutorials and more.
              </Text><br />
              <Text>
              My site has no ads, no affiliate links, no tracking or analytics, no sponsored posts, and no paywall. My only motivation for this site is to share what I've learned. I want to make the internet a better place just as many developers want to. Even if it's just right here. I hope I will inspire others to make their own creative corner on the web as well.
              </Text><br />
              <Text>
              You can contact me by email at <Link href={"mailto:devsamahd@gmail.com"} color={"blue"}><u>Devsamahd@gmail.com</u></Link> to say hi! I always appreciate meeting new people.
              </Text><br /><br /><br />
              <Text>
              Github <ExternalLinkIcon /><Link href={"https://www.github.com/devsamahd"} color={"blue"}><u>Devsamahd</u></Link>
              </Text><br /><br /><br />
              <Heading size={'lg'}>What I'm doing now</Heading><br /> <hr /><br />
              <List spacing={3}>

              <ListItem>
                <MinusIcon />
              Learning typescript and how to scale an application
              </ListItem>

              <ListItem>
                <MinusIcon />
              Studying for my Civil and Environmetal Engineering BTech degree
              </ListItem>

              <ListItem>
                <MinusIcon />
              Actively looking/hunting for a job
              </ListItem>

              </List><br /><br /><br />

              <Heading size={'lg'}>Tools and Skills</Heading><br /> <hr /><br />
              <Text fontSize={25}>Software and Hardware </Text>
              <List spacing={3}>

              <ListItem>
                <MinusIcon />
                <b>Coding:</b> VSCode
              </ListItem>
              <ListItem>
                <MinusIcon />
                <b>Design:</b> Figma
              </ListItem>
              <ListItem>
                <MinusIcon />
                <b>OS:</b> Windows 11 Pro
              </ListItem>
              <ListItem>
                <MinusIcon />
                <b>Music:</b> Groove
              </ListItem>

              <ListItem>
                <MinusIcon />
                <b>PC:</b> 10th Gen HP 15 15.6" core i5 1TB HDD 5gb RAM
              </ListItem>


              </List>
              <br />
              <Text fontSize={25}>Concepts</Text>
              <Text>Web and Mobile Application development, Design Patterns(REST API Design, MVC), UI design, Agile methodologies, Databases(SQL, MongoDB), Authentication(JWT, Auth0), Version Control(Git), Testing(Unit, Integration, End-to-End), CMS(Netlify, SanityIO), Server-Side rendering(Ejs, handlebars, NextJS)</Text>
              <br />
              <Text fontSize={25}>Languages</Text>
              <Text>JavaScript (React/Redux, Next, Gatsby), Node.js(Express, Redis), TypeScript, GraphQL, SQL, PHP, HTML5, CSS(CSS3, SASS, Bootstrap, ChakraUI), JSON</Text>


              <br /><br /><br /> 
            </div>
            <div className="col-md-3">
              <div className="card p-2">
                <div className="card-title">me</div>
                <img src="mehuman.jpg" alt="" />
              </div><br />
              <div className="card p-2">
                <div className="card-title">mevatar</div>
                <img src="devsamahd.svg" alt="" />
              </div>
            </div>
          </div>
      </div>
      </div>
    </>
    
  )
}

export default About