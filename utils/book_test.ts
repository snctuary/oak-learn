import { Book } from "./book.ts";

const API_URL = "http://localhost:8000/api/books";

Deno.test({
	name: "create book",
	async fn() {
		const data: Book = { id: 1, title: "First nih" };
		const response = await fetch(API_URL, {
			body: JSON.stringify(data),
			method: "POST",
		});

		const newBook = await response.json();
		console.log(newBook);
	},
});

Deno.test({
	name: "fetch books",
	async fn() {
		const response = await fetch(API_URL);
		const books = await response.json();
		console.log(books);
	},
});
