export class Scraper implements HTMLRewriterElementContentHandlers{
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