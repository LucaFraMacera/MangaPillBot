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
}
export interface MessageCallback{
    type:CALLBACK
    id:string
    data:any[]
}
