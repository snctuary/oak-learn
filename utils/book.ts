import { Router } from "@oak/oak/router";
import { kv } from "./core.ts";

export const bookRoutes = new Router({ prefix: "/api/books" });

bookRoutes
	.get("/", async (ctx) => {
		const books = await fetchBooks();
		ctx.response.body = books;
	})
	.post("/", async (ctx) => {
		const data: Book = await ctx.request.body.json();

		const newBook = await createBook(data);
		ctx.response.body = newBook;
	});

export interface Book {
	id: number;
	title: string;
}

export async function createBook(newBook: Book) {
	const commit = await kv.atomic().set(["books", newBook.id], newBook)
		.commit();

	if (commit.ok) {
		return newBook;
	} else {
		throw new Error("Failed to create book");
	}
}

export async function fetchBooks() {
	const books = await Array.fromAsync(kv.list<Book>({ prefix: ["books"] }));
	return books.map((entry) => entry.value);
}
