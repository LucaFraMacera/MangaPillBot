import { Env } from "."

export async function sendNotification(env:Env, newReleases:string[]) {
    let text = "Hey wake up!\n"
    if(newReleases.length == 0)
        return
    newReleases.map((manga)=>{
        text += manga+" has released.\n"
    })
    const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage?chat_id=${env.CHAT_ID}&text=${text}`
    return await fetch(encodeURI(url))
}