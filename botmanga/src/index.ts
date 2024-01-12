import { scrape } from "./scraper";


export interface Env {
	KVs:KVNamespace
	BOT_TOKEN:string
	CHAT_ID:string
}

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		const result = await scrape(env)
		console.log("Triggered",JSON.stringify(result))
	},
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return new Response('RUNNING..');
	},

};
