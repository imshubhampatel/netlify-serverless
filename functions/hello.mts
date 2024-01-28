import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  let data = req.headers.get("cookie");
  if (!data) {
    return new Response("No cookie found");
  }
  return new Response("Hello, Netlify Functions!");
};
