import { Context, Config } from "@netlify/functions";
import { getPath, getSymbolData } from "./utils/helper.mts";
import sendMessage from "./utils/sendMessage.mts";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

let cookieSecret = "this is cookie secret";

export default async (req: Request, context: Context) => {
  let pathname = getPath(req, context);
  console.log({ cookieSecret });

  if (pathname.includes("/auth/email") && req.method === "POST") {
    let body = await req.json();

    try {
      let { email } = body;
      const expirationTime = Math.floor(Date.now() / 1000) + 60 * 5; // valid 5 minutes
      const token = jwt.sign({ email, exp: expirationTime }, cookieSecret);
      const cookieHeader = `Set-Cookie: magic_link=${token}; Max-Age=${
        60 * 5
      }; Secure; HttpOnly; SameSite=None`;

      const redirectURL = `${req.url + "/verify"}?magic_link=${token}`;

      await sendMessage(
        email,
        "Magic Link",
        `<a href="${redirectURL}">Click here to login</a>`
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader,
        },
      });
    } catch (error) {
      // response when server error happens
      return new Response(
        JSON.stringify({
          success: false,
          message: "Internal Server Error",
          error,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  if (pathname.includes("/auth/email/verify") && req.method === "GET") {
    let latestURL = new URL(req.url);
    let magic_link = latestURL.searchParams.get("magic_link");
    let userData = jwt.verify(magic_link, cookieSecret);
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // valid 5 minutes
    const token = jwt.sign(
      { email: userData.email, exp: expirationTime },
      cookieSecret
    );
    const cookieHeader = `Set-Cookie: auth=${token}; Max-Age=${
      60 * 1
    }; Secure; HttpOnly; SameSite=None; Path=/`;

    return new Response("", {
      status: 302,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieHeader,
        Location: "/hello",
      },
    });
  }

  return new Response(
    JSON.stringify({ success: false, message: "Internal Server Error" }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
