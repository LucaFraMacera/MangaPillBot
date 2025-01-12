import * as cheerio from "cheerio"
import { Env, MangaRelease } from "../types"

const MANGAPILL_BASE_URL = `https://mangapill.com`
const KV_KEY = 'mostRecentManga'

async function scrapeSite(href:string, mostRecent:string): Promise<MangaRelease[]>{
    const result = await fetch(href)
    const data = await result.text()
    const scrapedData = cheerio.load(data)
    const mangaReleases:MangaRelease[] = []
    let hasFinished = false
    scrapedData("div").each((index, element)=>{
        const mangaInfoDiv = scrapedData(element)
        const mangaInfoDivClass = mangaInfoDiv.attr("class")
        if(!mangaInfoDivClass || mangaInfoDivClass != 'px-1' || hasFinished)
            return
        const releaseLink = `${MANGAPILL_BASE_URL}${mangaInfoDiv.children('a').get(0)?.attribs['href']}`
        const mangaLink = `${MANGAPILL_BASE_URL}${mangaInfoDiv.children('a').get(1)?.attribs['href']}`
        const chapNumber = scrapedData(mangaInfoDiv.children('a').get(0)).text().trim()
        const mangaName = getMangaName(scrapedData(mangaInfoDiv.children('a').get(1)).text().trim())
        if(mangaName === mostRecent){
            hasFinished = true
            return
        }
        mangaReleases.push({
            chapterUrl:releaseLink || "",
            mangaUrl:mangaLink || "",
            chatpterNumber:chapNumber || "",
            name:mangaName
        })
    })
    return mangaReleases
}

function getMangaName(name:string){
    return name.split('\n').map(name => name.trim()).filter(name => name.length > 0).reduce((accumulator, current)=>`${accumulator} (${current})`)

}


export async function scrape(env:Env){
    const mostRecent = await env.KVs.get(KV_KEY) || ""
    const releases = await scrapeSite(`${MANGAPILL_BASE_URL}/chapters`, mostRecent)
    if(releases.length > 0){
        await env.KVs.put(KV_KEY, releases[0].name)
    }
    return releases
}



