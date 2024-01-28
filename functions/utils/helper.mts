import type { Context } from "@netlify/functions";
import { Readable } from "stream";

export function getPath(req: Request, context: Context): string {
  let url: string = context.site.url + "/.netlify/functions";
  return req.url.replace(url, "");
}

export function getSymbolData(req: Request, entity: String): object {
  console.log(Reflect.ownKeys(req));
  const stateSymbol = Reflect.ownKeys(req).filter(
    (key) => typeof key === "symbol" && key.description === entity
  )[0];

  const stateObject = stateSymbol ? req[stateSymbol] : null;
  return stateObject;
}
