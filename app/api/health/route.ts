function withCors(response: Response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  return response;
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}

export async function GET() {
  return withCors(Response.json({ ok: true }));
}
