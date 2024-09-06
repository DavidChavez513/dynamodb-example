import { app } from "./app"

interface User {
	id: number;
	name: string;
	lastName: string;
	age?: number;
	address?: string;
	create_at: string;
	update_at: string;
}

const body = {
	"id": 1,
	"name": "John",
	"lastName": "Doe",
	"age": 30,
	"address": "123 Main St",
} as User;


app(body);