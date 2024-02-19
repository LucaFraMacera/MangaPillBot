import { Env } from "./types"
import getMessageInfo from "./message"
import { scrapeMangapill,scrape9Anime } from "./cronsOperations"


export async function sendMangaNotification(env:Env, newReleases:string[]) {
   return await sendAllMangas(env.BOT_TOKEN,env.CHANNEL_ID,newReleases)
}
export async function sendAnimeNotification(env:Env, newReleases:string[]) {
    return await sendAllAnimes(env.BOT_TOKEN,env.CHANNEL_ID,newReleases)
 }
export async function sendMessage(token:string,chatID:string,name:string) {
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${name}&parse_mode=HTML`
    return await fetch(encodeURI(url))
}

function removeSpecialCaracters(name:string){
    const regex = /[\?\+\'\"&=:%;,#]/gm
    return name.replaceAll(regex," ")
}
function replaceHTMLCodes(name:string){
    return name.replaceAll("&#34", "").replaceAll("&#39", "`").replaceAll("&#38", "And")
}
export async function manageMessage(payload:any,env:Env){
    const message = getMessageInfo(payload)
    if(message == undefined)
        return
    if("command" in message){
        switch(message.command){
            case "greet":
                if(message.fromID == env.CHANNEL_ID)
                    await sendBroadcast(env)
                break
            case "get":
                try {
                    const result = await scrapeMangapill(env)
                    if(result.length === 0){
                        await sendMessage(env.BOT_TOKEN,message.fromID,"No manga were released.")
                        return
                    }
                    console.log(result)
                    await sendAllMangas(env.BOT_TOKEN,env.CHANNEL_ID,result)
                } catch (error) {
                    await sendMessage(env.BOT_TOKEN,message.fromID,"Something went wrong 😐 (0€)")
                }
                break
            case "get1":
                const result = await scrape9Anime(env)
                if(result.length === 0){
                    await sendMessage(env.BOT_TOKEN,message.fromID,"No anime episode were released.")
                    return
                }
                console.log(result)
                await sendAllAnimes(env.BOT_TOKEN, message.fromID, result)
                break
            default:
                break
        }
    }
    return
}
async function sendAllMangas(token:string,chatID:string,mangas:string[]){
    if(mangas.length == 0)
        return
    let text = "Hey, <b>wake up‼️</b> New <b>chapters</b> dropped 📖!\n"
    mangas.map((manga)=>{
        text += `> [<b>${removeSpecialCaracters(replaceHTMLCodes(manga))}</b>] has been released.\n\n`
    })
    await sendMessage(token,chatID,text)
}

async function sendAllAnimes(token:string,chatID:string,animes:string[]){
    if(animes.length == 0)
        return
    let text = "Hey, <b>wake up‼️</b> New <b>episodes</b> dropped 📺!\n"
    animes.map((anime)=>{
        text += `> [<b>${removeSpecialCaracters(replaceHTMLCodes(anime))}</b>] has been released.\n\n`
    })
    await sendMessage(token,chatID,text)
}

async function sendBroadcast(env:Env){
    const text = "Hi.\nthis is a message broadcast to let you know that new manga releases will be shared here in this chat."
    await sendMessage(env.BOT_TOKEN,env.CHANNEL_ID,text)
}
/*
*/