import { fetchPrayerTimes } from "@/lib/prayer-api";

function withCors(response: Response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  return response;
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location")?.trim();
  const date = searchParams.get("date")?.trim() || undefined;

  if (!location) {
    return withCors(
      Response.json({ error: "Missing location query parameter." }, { status: 400 }),
    );
  }

  try {
    const prayerTimes = await fetchPrayerTimes(location, date);
    return withCors(Response.json(prayerTimes));
  } catch (error) {
    return withCors(
      Response.json(
        {
          error: error instanceof Error ? error.message : "Unknown server error",
        },
        { status: 500 },
      ),
    );
  }
}
