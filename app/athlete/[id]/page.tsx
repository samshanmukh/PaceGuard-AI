import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeSession, SESSION_COOKIE } from "@/lib/session";
import AthletePortal from "./portal";

export default async function AthletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await cookies();
  const session = decodeSession(store.get(SESSION_COOKIE)?.value);
  if (!session || session.role !== "athlete" || session.athleteId !== id) redirect(`/login?role=athlete&next=/athlete/${id}`);
  return <AthletePortal athleteId={id} name={session.name} />;
}
