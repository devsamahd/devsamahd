import {
  Box,
  Heading,
  Img,
  Flex,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { urlFor } from '../lib/sanity';
import Tags from './Tags';

export const SectionNumber = ({ number, title}: { number: number, title: string}) => {
    return(
        <Flex
          align={'center'}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: 'gray.300',
            flexGrow: 1,
            ml: 0,
            mr: {base:"0%", md:"50%"}
        }}
        >
        <Flex
        p={5}
        fontSize={20}
        fontWeight={600}
        fontFamily={'monospace'}
        color={'blue.400'}
        >
            0{number}.&nbsp;<Text color={'gray.900'} fontSize={'3xl'}>{title}</Text>
        </Flex>
        </Flex>
        
    )
}




const ProjectSection = ({data}:{data:any[]}) => {
    const newData = ((data.reverse()).slice(0,3))
  return (
        <div style={{"marginTop":"40px"}}>
          <SectionNumber number={2} title={`Some things I've built`} />
        <div>
            {
                newData && newData.map((project:any, key:number) => (
                <div key={key} className="pt-5 project-section" data-aos="slide-up">
                    
                    <Box
                    className='project-content'
                    style={{
                        "position": "relative",
                        "display":"grid",
                        "gap": "10px",
                        "gridTemplateColumns": "repeat(12, 1fr)",
                        "boxAlign": "center",
                        "alignItems": "center"
                    }}
                    >
                        
                        <Box
                        style={{
                            "position":"relative",
                            "gridArea": "1 / 1 / -1 / 7",
                            "zIndex":2,
                        }}
                        >
                            <Heading 
                            size={"md"}
                            pb={"40px"}
                            color={'gray.700'}
                            >{project.name}</Heading>
                            <Box
                            style={{
                            "minHeight":"100px",
                            "background":"#1A202C",
                            "padding":"20px",
                            "borderRadius":"10px"
                            }}
                            > 
                                <Flex color='gray.300'>{project.description}</Flex>
                            </Box>
                            <Tags tags={project.tags.map((tag:any)=> tag.title)} heading=""/>
                        </Box>

                        <Box
                            width={"50vw"}
                            my={5}
                            overflow={'hidden'}
                            borderTop={"30px solid"}
                            borderLeft={"30px solid"}
                            style={{
                                "boxShadow": "0 10px 30px -15px var(--navy-shadow)",
                                "transition": "var(--transition)",
                                "gridArea": "1 / 6 / -1 / -1",
                                "position": "relative",
                                "zIndex": 1,
                                "borderRadius":"10px"
                            }}
                            _before={{
                                "content": '""',
                                "position": "absolute",
                                "width": "100%",
                                "height": "100%",
                                "inset": "0px",
                                "zIndex": 3,
                                "transition": "var(--transition)",
                                "background-color": "gray",
                                "mix-blend-mode": "screen"
                            }}
                            >
                            <Img
                                src={urlFor(project.mainImage).url()}
                                h="100%"
                                w="100%"
                                alt={'Blog Image'}
                            />
                        </Box>
                        
                    </Box>
                </div>
                ))
            }
            
        </div>
    </div>
  )
}




export default ProjectSection