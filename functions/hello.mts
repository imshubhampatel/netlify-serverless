import type { Context } from '@netlify/functions';

export default async (req: Request, context: Context) => {
	console.log('here i am');
	return new Response('Hello, Netlify Functions!');
};
