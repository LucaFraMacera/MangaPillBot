import { Env } from "./types"

class Scraper implements HTMLRewriterElementContentHandlers{
    protected site = ""
    protected KEY = ""
    protected mostRecent = ""
    protected index = 0
    protected old = false
    protected newMostRecent = ""
    protected releases:string[] = []

    protected constructor(site:string, key:string){
        this.site = site
        this.KEY = key
    }

    protected insertNewRelease = (release:string) =>{
        if(release === this.mostRecent)
            this.old= true
        if(this.index == 0)
            this.newMostRecent = release
        if(!this.old){
            this.releases.push(release!)
        }
        this.index++
    }

    protected consume = async (stream:ReadableStream)=>{
        const reader = stream.getReader()
        while(!(await reader.read()).done){}
    }

    element(element: Element): void | Promise<void> {}
}

export class MangapillScraper extends Scraper{
    
    private rewriter = new HTMLRewriter().on("img",this)

    constructor(){
        super("https://mangapill.com/chapters","mostRecentManga")
    }

    scrape = async (env:Env)=>{
        this.mostRecent = await env.KVs.get(this.KEY) || ""
        const response = await fetch(this.site)
        if (!response.ok) 
            throw Error('Scrape shield encountered!');
        this.releases.fill("")
        this.index = 0
        await this.consume(this.rewriter.transform(response).body!)
        await env.KVs.put(this.KEY, this.newMostRecent)
        return this.releases
    }

    element(element: Element): void | Promise<void> {
        const manganame = element.getAttribute("alt")
        if(!manganame)
            return
        this.insertNewRelease(manganame)
    }
}

export class NineAnimeScraper extends Scraper{
    private rewriter = new HTMLRewriter().on("a",this)

    constructor(){
        super("https://9animetv.to/recently-updated","mostRecentAnime")
    }

    scrape = async (env:Env)=>{
        this.mostRecent = await env.KVs.get(this.KEY) || ""
        const response = await fetch(this.site)
        if (!response.ok) 
            throw Error('Scrape shield encountered!');
        this.releases.fill("")
        this.index = 0
        await this.consume(this.rewriter.transform(response).body!)
        await env.KVs.put(this.KEY, this.newMostRecent)
        return this.releases
    }

    element(element: Element): void | Promise<void> {
        if(this.index >= 40)
            return
        const className = element.getAttribute("class")
        if(className != "dynamic-name")
            return
        const manganame = element.getAttribute("title")
        if(!manganame)
            return
        this.insertNewRelease(manganame)
    }
}







