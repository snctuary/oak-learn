import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { ServerSentEvent } from "@oak/commons/server_sent_event";

const router = new Router();

router.get("/", async (ctx) => {
	const events = await ctx.sendEvents();

	let sequences = 0;
	setInterval(
		() =>
			events.dispatchEvent(
				new ServerSentEvent("ping", { data: String(sequences++) }),
			),
		2_000,
	);
});

const app = new Application();

app.use(router.routes());
app.listen({ port: 8000 });
