
import { scrape } from "./scrapers/mangapillCherioScraper"
import { Env } from "./types"

export async function scrapeMangapill(env:Env){
    return await scrape(env)
}

