import {
  Box,
  Heading,
  Img,
  Flex,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { urlFor } from '../lib/sanity';

export const SectionNumber = ({ number, title}: { number: number, title: string}) => {
    return(
        <Flex
          align={'center'}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: 'gray.700',
            flexGrow: 1,
            ml: 0
        }}
        >
        <Flex
        p={5}
        fontSize={20}
        fontWeight={600}
        fontFamily={'monospace'}
        color="lightblue"
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
          <SectionNumber number={1} title={'Projects'} />
        <div>
            {
                newData && newData.map((project:any, key:number) => (
                <div key={key} className="pt-5">
                    <Heading size={"lg"}>{project.name}</Heading>
                    <Flex 
                    color={useColorModeValue('gray.600','gray.200')}
                    _after={{
                        content: `"${project.year}"`,
                        borderBottom: '2px solid',
                        borderColor: useColorModeValue("#1A202C", "#FFFFFFEB"),
                        flexGrow: 1,
                        textAlign:"right",
                        ml: 1,
                    }}>{project.description}</Flex>
                    
                        <Box
                            w={"100%"}
                            my={5}
                            overflow={'hidden'}
                            bg={useColorModeValue('gray.100','gray.900')}
                            borderTop={"30px solid"}
                            borderLeft={"30px solid"}
                            borderColor={useColorModeValue("gray.900","gray.100")
                        }
                            >
                            <Img
                                src={urlFor(project.mainImage).url()}
                                h="100%"
                                w="100%"
                                alt={'Blog Image'}
                            />
                        </Box>
                </div>
                ))
            }
            
        </div>
    </div>
  )
}




export default ProjectSection