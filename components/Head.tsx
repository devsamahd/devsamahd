import Head from "next/head"
import {useEffect} from 'react'

const Meta = ({ title , desc, image, type }:{title:string, desc:string, image:string, type:string}) => {
  let getpath
  useEffect(() => {
    getpath = window.location.href
  }, [])
  return (
    <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="Devsamahd" />
        <meta property="og:url" content={getpath} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content={type} />
        <meta property="og:image" content={image} />
        <link rel="icon" href="me.svg" />
        <link rel="shortcut icon" href="me.svg" type="image/x-icon" />
      </Head>
  )
}
Meta.defaultProps = {
  title: "AO Abdulsalam | DevSamahd",
  desc: "Abdulsalam Abdulsamad, professional software developer with a knack for creating effective and efficient software solutions.",
  image: "me.svg",
  type: "website"
}

export default Meta
