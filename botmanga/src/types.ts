export interface Message {
    ID:string
    chatID:string
    fromID:string
    from:string
    date:number
    text:string
    reply_to?:Message
    command?:string
}

export enum BroadcastEnum{
    SINGLE='single',
    LIST='list'
}

export enum CALLBACK {
    DEFAULT,
    LIST,
    REPLY
}
export interface QueryMessage extends Message{
    callbackData:MessageCallback
}

export interface Env {
	KVs:KVNamespace
	BOT_TOKEN:string
	CHANNEL_ID:string
    BROADCAST: BroadcastEnum
}

export interface MessageCallback{
    type:CALLBACK
    id:string
    data:any[]
}

export interface MangaRelease{
    name:string
    chatpterNumber:string
    chapterUrl:string
    mangaUrl:string 
    imageUrl?:string
}
