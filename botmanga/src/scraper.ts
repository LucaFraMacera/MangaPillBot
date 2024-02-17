import { MangapillScraper, NineAnimeScraper } from "./scrapers"
import { Env } from "./types"

export async function scrapeMangapill(env:Env){
    const mangaPillScraper = new MangapillScraper()
    return await mangaPillScraper.scrape(env)
}

export async function scrape9Anime(env:Env){
    const nineAnimeScraper = new NineAnimeScraper()
    return nineAnimeScraper.scrape(env)
}
