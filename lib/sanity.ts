import { createClient } from "next-sanity"
import ImageUrlBuilder from "@sanity/image-url"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"


const config = {
    projectId: "wb3euro1",
    dataset: "production",
    apiVersion: "2021-10-21",
    useCdn: false
}
export const SanityClient = createClient(config)

const builder = ImageUrlBuilder(config)

export const urlFor = (source: SanityImageSource) => builder.image(source)