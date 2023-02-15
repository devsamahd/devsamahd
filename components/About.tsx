import { SectionNumber } from './ProjectSection'
import { Box, Image } from '@chakra-ui/react'
import Tags from './Tags'

const About = () => {
  return (
    <>
        <SectionNumber number={1} title={`About me`} />
        <div className="row" data-aos="fade-in" id='about'>

          <div className="col-md-6">
            <Box
            fontWeight={500}
            >
              Hello! My name is Abdulsamad. I'm most times a FullStack web developer and sometimes a civil engineer(in training) from Nigeria <b>NG</b>. <br /> <br />
              I have over 3 years of experience, building usable softwares, learning, exploring, and teaching building of applications and solutions that span across several sectors.<br /> <br />

              I'm always motivated to build or lead people to come up with what users will love and will satisfy business requirements. I am dynamic in my operations and I'm always yearning to make an impact line by line. <br /> <br />

              Here are a few technologies I've been working with recently: <br /> <br />
              <Tags heading='' tags={["JavaScript(ES6+)","ReactJS/NextJS/Redux","HTML/(S)CSS","Figma","NodeJS/Express/MongoDB","UI/UX", "PHP/MySQL", "TypeScript"]} />

            </Box>
          </div>
          <div className="col-md-1"></div>

          <div className="col-md-5"><br />
            <Box
              width={"50%"}
              className="wrapper"
            >
              <Image 
              src="mehuman.jpg" 
              alt=""
              style={{
                "filter":"grayscale(0.8)"
              }}
              />
            </Box>
          </div>

        </div>
    </>
         
  )
}

export default About