import { Heading, Tag } from "@chakra-ui/react"

const Tags = ({tags, heading}:{tags:string[], heading:string}) => {
  return (
    <div className="mt-5">
        <Heading size={"lg"} textAlign={"right"} mb={"3"}>{heading}</Heading>
        {
            tags.map(tag =>( 
                <Tag
                as={"span"}
                key={tags.indexOf(tag)}
                border={"1px solid"}
                m={1}
                >
                    {tag}
                </Tag>
            ))
        }
    </div>
  )
}


export default Tags