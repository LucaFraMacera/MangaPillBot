import { Env } from "../types"
import {Scraper} from "./scraper"

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