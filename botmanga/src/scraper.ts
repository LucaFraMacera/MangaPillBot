import { Env } from "./types"
const KV_KEY = "mostRecentManga"
const mangas:string[] = []
const MANGA_SITE = "https://mangapill.com/chapters"
let mostRecentManga= ""
let old = false
let index = 0
let newMostRecent = ""

const rewriter = new HTMLRewriter()
      .on("img", {
        element(el) {
            const manganame = el.getAttribute("alt")
            if(!manganame)
                return
            if(manganame === mostRecentManga)
                old= true
            if(index == 0)
                newMostRecent = manganame!
            if(!old){
                mangas.push(manganame!)
            }
            index++
        }
    })
export async function scrape(env:Env){
    mostRecentManga = await env.KVs.get(KV_KEY) || ""
    const response = await fetch(MANGA_SITE)
    if (!response.ok) 
        throw Error('Scrape shield encountered!');
    mangas.fill("")
    index = 0
    await consume(rewriter.transform(response).body!)
    await env.KVs.put(KV_KEY, newMostRecent)
    return mangas
}

async function consume(stream:ReadableStream){
    const reader = stream.getReader()
    while(!(await reader.read()).done){}
}