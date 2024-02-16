import { Env } from "./types"
const KV_KEY = ["mostRecentManga","mostRecentAnime"]
const mangas:string[] = []
const MANGA_SITEs = {
    mangapill:"https://mangapill.com/chapters",
    nineAnime:"https://9animetv.to/recently-updated"
}
let mostRecent= ""
let old = false
let index = 0
let newMostRecent = ""

function insertNewRelease(release:string){
    if(release === mostRecent)
        old= true
    if(index == 0)
        newMostRecent = release
    if(!old){
        mangas.push(release!)
    }
    index++
}

const mangaPillRewriter = new HTMLRewriter()
      .on("img", {
        element(el) {
            const manganame = el.getAttribute("alt")
            if(!manganame)
                return
            insertNewRelease(manganame)
        }
    })

const aniwaveRewriter = new HTMLRewriter().on("a", {
    element(elem){
        if(index >= 40)
            return
        const className = elem.getAttribute("class")
        if(className != "dynamic-name")
            return
        const manganame = elem.getAttribute("title")
        if(!manganame)
            return
        insertNewRelease(manganame)
    }
})


export async function scrapeMangapill(env:Env){
    mostRecent = await env.KVs.get(KV_KEY[0]) || ""
    const response = await fetch(MANGA_SITEs.mangapill)
    if (!response.ok) 
        throw Error('Scrape shield encountered!');
    mangas.fill("")
    index = 0
    await consume(mangaPillRewriter.transform(response).body!)
    await env.KVs.put(KV_KEY[0], newMostRecent)
    return mangas
}

export async function scrape9Anime(env:Env){
    mostRecent = await env.KVs.get(KV_KEY[1]) || ""
    const response = await fetch(MANGA_SITEs.nineAnime)
    if (!response.ok) 
        throw Error('Scrape shield encountered!');
    mangas.fill("")
    index = 0
    await consume(aniwaveRewriter.transform(response).body!)
    await env.KVs.put(KV_KEY[1], newMostRecent)
    return mangas
}

async function consume(stream:ReadableStream){
    const reader = stream.getReader()
    while(!(await reader.read()).done){}
}