import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { streamServerSent } from "./utils/server_sent_events.ts";

const router = new Router();

router.get("/", (ctx) => {
	ctx.response.headers = new Headers({
		"content-type": "text/event-stream",
	});
	ctx.response.body = streamServerSent((stream) => {
		let sequences = 1;
		const interval = setInterval(
			() =>
				stream.postEvent({ event: "ping", data: String(sequences++) }),
			2_000,
		);

		return () => {
			clearInterval(interval);
		};
	});
});

const app = new Application();

app.use(router.routes());
app.listen({ port: 8000 });
