import { scrapeMangapill } from "./cronsOperations";
import { Env } from "./types";
import { manageMessage, sendMessage, sendMangaNotification } from "./telegramLogic";
export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		try {
			const [mangaReleases] = await Promise.all([scrapeMangapill(env)])
			await sendMangaNotification(env, mangaReleases)
			//await sendAnimeNotification(env,animeReleases)
		} catch (error) {
			await sendMessage(env.BOT_TOKEN,env.CHANNEL_ID,`An error has occured while scraping.\n${error}`)
		}
		
	},
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === "POST"){
			const payload = await request.json()! as any
			try{
				await manageMessage(payload,env)
			}catch(error){
				await sendMessage(env.BOT_TOKEN,env.CHANNEL_ID,`An error has occured while your request was being processed.\n${error}`)
			}
		}
		return new Response('RUNNING...');
	},

};
