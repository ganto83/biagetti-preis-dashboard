import type { Context, Config } from "@netlify/edge-functions";

const USERNAME = "masterbali";
const PASSWORD = "Tartufi4all";

export default async (req: Request, context: Context) => {
  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const separatorIndex = decoded.indexOf(":");
        const user = decoded.slice(0, separatorIndex);
        const pass = decoded.slice(separatorIndex + 1);
        if (user === USERNAME && pass === PASSWORD) {
          return context.next();
        }
      } catch {
        // fall through to 401
      }
    }
  }

  return new Response("Zugriff verweigert. Bitte Benutzername und Passwort eingeben.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Biagetti Preis-Dashboard", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

export const config: Config = {
  path: "/*",
};
