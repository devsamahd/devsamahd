import Head from "next/head"

const Meta = ({ title , desc }:{title:string, desc:string}) => {
  return (
    <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="me.svg" />
      </Head>
  )
}
Meta.defaultProps = {
  title: "AO Abdulsalam | DevSamahd",
  desc: "Abdulsalam Abdulsamad, professional software developer with a knack for creating effective and efficient software solutions."
}

export default Meta
