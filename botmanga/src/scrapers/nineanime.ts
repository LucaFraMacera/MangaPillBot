import { Env } from "../types"

export class NineAnimeScraper extends Scraper{
    private rewriter = new HTMLRewriter().on("a",this)

    constructor(){
        super("https://9animetv.to/recently-updated","mostRecentAnime")
    }
    protected insertNewRelease = (release:string) =>{
        if(this.index >= 40)
            return
        if(release === this.mostRecent)
            this.old= true
        if(this.index == 0)
            this.newMostRecent = release
        if(!this.old)
            this.releases.push(release)
        this.index++
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
