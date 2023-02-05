import { createClient } from "next-sanity"
import ImageUrlBuilder from "@sanity/image-url"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"


const config = {
    projectId: "wb3euro1",
    dataset: "production",
    apiVersion: "2021-10-21",
    token:"skes8Q1QkSpy1SA6FcJQg82zc0IGoMY43o4dgAhKCUO3abDvUwog1imO9WT4xGMFTjr73ZSZvfi1xXO7h9ot09XhAkshrnNpuXBlIJFljuuyLIxExYWvxsqv52VLbwu0PeDDkyBIUQfyOMBBqjTe7WNbil3opnlCooJa6eLJrPjUpf1zlFAv",
    useCdn: false
}
export const SanityClient = createClient(config)

const builder = ImageUrlBuilder(config)

export const urlFor = (source: SanityImageSource) => builder.image(source)