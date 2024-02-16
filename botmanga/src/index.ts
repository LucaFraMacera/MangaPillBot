import { scrape } from "./scraper";
import { Env } from "./types";
import { manageMessage, sendMessage, sendNotification } from "./telegramLogic";
export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		try {
			const result = await scrape(env)
			await sendNotification(env,result)
		} catch (error) {
			await sendMessage(env.BOT_TOKEN,env.CHANNEL_ID,`An error has occured.\n${error}`)
		}
		
	},
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === "POST"){
			const payload = await request.json()! as any
			try{
				console.log(payload)
				await manageMessage(payload,env)
			}catch(error){
				await sendMessage(env.BOT_TOKEN,env.CHANNEL_ID,`An error has occured.\n${error}`)
			}
		}
		return new Response('RUNNING...');
	},

};
