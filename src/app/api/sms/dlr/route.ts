import { NextResponse } from "next/server";
import { env } from "~/env";

const dlrSchema = {
  messageId: "",
  dlrTime: "",
  dlrStatus: "",
  dlrDesc: "",
  tat: undefined as number | undefined,
  network: "",
  destaddr: "",
  sourceaddr: "",
  origin: "",
};

export async function POST(request: Request) {
  const secret = env.MOBITECH_DLR_SECRET;

  if (secret) {
    const token = request.headers.get("x-dlr-secret") ?? new URL(request.url).searchParams.get("token");
    if (token !== secret) {
      return NextResponse.json({ success: false, error: "Unauthorized DLR callback" }, { status: 401 });
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = payload as Partial<typeof dlrSchema>;

  if (!parsed.messageId || !parsed.dlrStatus || !parsed.destaddr || !parsed.sourceaddr) {
    return NextResponse.json(
      { success: false, error: "Missing required DLR fields" },
      { status: 400 }
    );
  }

  console.log("Mobitech DLR received", {
    messageId: parsed.messageId,
    dlrStatus: parsed.dlrStatus,
    dlrDesc: parsed.dlrDesc,
    destaddr: parsed.destaddr,
    sourceaddr: parsed.sourceaddr,
    network: parsed.network,
    origin: parsed.origin,
    dlrTime: parsed.dlrTime,
    tat: parsed.tat,
  });

  return NextResponse.json({ success: true });
}
