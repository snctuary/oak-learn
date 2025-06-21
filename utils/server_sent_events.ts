interface EventData {
	event: string;
	data: string;
}

interface EventStreamer {
	postEvent(data: EventData): void;
}

type CloseFn = () => void;
type StreamFn = (streamer: EventStreamer) => CloseFn;

export function streamServerSent(fn: StreamFn) {
	const encoder = new TextEncoder();
	let closeFn: CloseFn;

	const body = new ReadableStream({
		start(cont) {
			function postEvent(data: EventData) {
				cont.enqueue(
					encoder.encode(
						`event: ${data.event}\ndata: ${data.data}\n\n`,
					),
				);
			}
			closeFn = fn({ postEvent });
		},
		cancel() {
			if (closeFn) {
				closeFn();
			}
		},
	});

	return body;
}
