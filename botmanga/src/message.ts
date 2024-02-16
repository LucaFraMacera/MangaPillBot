import {CALLBACK, Message, MessageCallback, QueryMessage} from "./types"
interface TelegramCommand{
    offset:number
    length:number
    type:string
}
export default function getMessageInfo(telegramPayload : any):Message|undefined{
    let telegramMessage:any
    let result:Message
    let command:string|undefined
    if("message" in telegramPayload){
        telegramMessage = telegramPayload.message
        result = getMessage(telegramMessage)
    }
    else if("edited_message" in telegramPayload){
        telegramMessage = telegramPayload.edited_message
        result = getEditedMessage(telegramMessage)
    }
    else if("callback_query" in telegramPayload){
        telegramMessage = telegramPayload.callback_query
        result = getCallBackQuery(telegramMessage)
    }
    else
        return undefined
    if("entities" in telegramMessage)
        command = getCommand(telegramMessage.entities,result.text)
    if(command){
        result.command = command
        result.text = result.text.replaceAll(`/${result.command}`,"").trim()
    }
    return result
}

function getMessage(payload:any):Message{
    const result:Message = {
        ID:payload.message_id,
        chatID:payload.chat.id,
        fromID:payload.from.id,
        from:payload.from.username? payload.from.username: payload.from.first_name,
        text:"text" in payload ? payload.text : "",
        date: payload.date
    }
    if("reply_to_message" in payload)
        result.reply_to = getMessage(payload.reply_to_message)
    return result
}
function getEditedMessage(payload:any):Message{
    const result = getMessage(payload)
    result.date = payload.edit_date
    return result
}
function getCallBackQuery(payload:any):QueryMessage{
    const payloadData = payload.data.split(",")
    let callbackData:MessageCallback= {
        type:CALLBACK.DEFAULT,
        id:payload.id,
        data: []
    }
    if(payloadData && payloadData.length > 1){
        const type = parseInt(payloadData[0])
        callbackData = {
            type:type,
            id:payload.id,
            data: [...payloadData.slice(1)]
        }
    }
    const result:QueryMessage= {
        ID:payload.message.message_id,
        chatID:payload.message.chat.id,
        fromID:payload.from.id,
        from:payload.from.username,
        text:payload.message.text,
        date: payload.message.date,
        callbackData:callbackData
    }
    return result
}
function getCommand(entities:any,messageText:string):string|undefined{
    const commandINFO = entities[0] as TelegramCommand
    let command:string
    if("type" in commandINFO && commandINFO.type === "bot_command"){
        const atPosition = messageText.indexOf("@")
        if(atPosition > 0)
            command = messageText.substring(commandINFO.offset+1,atPosition)
        else
            command = messageText.substring(commandINFO.offset+1,commandINFO.offset+commandINFO.length)
        return command
    }
    return undefined
}