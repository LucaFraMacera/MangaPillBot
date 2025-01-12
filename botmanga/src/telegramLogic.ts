import { BroadcastEnum, Env, MangaRelease, Message } from "./types"
import getMessageInfo from "./message"
import { scrapeMangapill } from "./cronsOperations"


export async function sendMangaNotification(env:Env, newReleases:MangaRelease[]) {
   return await sendAllMangas(env,newReleases)
}
export async function sendMessage(token:string,chatID:string,name:string) {
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${name}&parse_mode=HTML`
    return await fetch(encodeURI(url))
}

async function sendPostMessage(token:string, chatID:string, text:string){
    const url = `https://api.telegram.org/bot${token}/sendMessage`
    const body = {
        chat_id:chatID,
        text:text,
        parse_mode:"HTML"
    }
    return await fetch(encodeURI(url),{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
}

export async function sendMessageWithPhoto(token:string, chatID:string, photoURL:string, caption:string) {
    //photoURL = encodeURI(photoURL)
    const url = `https://api.telegram.org/bot${token}/sendPhoto`
    const body = {
        chat_id:chatID,
        caption:caption,
        parse_mode:"HTML",
        photo:photoURL
    }
    return await fetch(encodeURI(url),{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
}

function createTelegramLink({href, text}:{href:string, text:string}){
    console.log(href)
    return `<a href='${href}'>${text}</a>`
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
                    env.CHANNEL_ID = message.fromID
                    if(result.length === 0){
                        await sendMessage(env.BOT_TOKEN,message.fromID,"No manga were released.")
                        return
                    }
                    console.log(result)
                    await sendAllMangas(env,result)
                } catch (error) {
                    await sendMessage(env.BOT_TOKEN,message.fromID,"Something went wrong 😐 (0€)")
                }
                break
            default:
                break
        }
    }
    return
}
async function sendAllMangas(env:Env,mangas:MangaRelease[]){
    if(mangas.length == 0)
        return
    switch(env.BROADCAST){
        case BroadcastEnum.LIST:{
            let text = "Hey, <b>wake up‼️</b> New <b>chapters</b> dropped 📖\n"
            mangas.map((manga)=>{
                text += `>[<b>${manga.name}</b> chapter <b>${manga.chatpterNumber}</b>] has been released.\n\n`
            })
            await sendPostMessage(env.BOT_TOKEN,env.CHANNEL_ID,text)
            break
        }
        default:
            for(const manga of mangas){
                let text = `Hey, <b>wake up‼️</b> a new chapter has released👀\n\n<b>${manga.name}</b> <b>${createTelegramLink({href:manga.chapterUrl, text:manga.chatpterNumber})}</b>\n\nCheck out the rest of the manga ${createTelegramLink({href:manga.mangaUrl, text:"here📖"})}`
                console.log(text)
                await sendPostMessage(env.BOT_TOKEN,env.CHANNEL_ID, text)
            }
            
    }
}

async function sendBroadcast(env:Env){
    const text = "Hi.\nthis is a message broadcast to let you know that new manga releases will be shared here in this chat."
    await sendMessage(env.BOT_TOKEN,env.CHANNEL_ID,text)
}
/*
*/