import { HttpError } from "../_shared/academy-core.ts";
import {
  db,
  deliverOutbox,
  endpoint,
  fulfill,
  json,
  limited,
  requireUser,
} from "../_shared/academy-runtime.ts";
Deno.serve(endpoint(async (req, origin) => {
  const user = await requireUser(req);
  await limited("verify:" + user.id, 30);
  const { session_id } = await req.json();
  if (
    typeof session_id !== "string" ||
    !/^cs_(live|test)_[A-Za-z0-9]+$/.test(session_id)
  ) throw new HttpError(400, "Невалидна платежна сесия.");
  const result = await fulfill(session_id, user.id);
  await deliverOutbox(session_id).catch(() =>
    console.warn("[academy] delivery pending")
  );
  const { data: profile, error } = await db.from("profiles").select(
    "unlocked_modules,has_full_access",
  ).eq("id", user.id).single();
  if (error) throw error;
  return json(
    {
      ...result,
      unlocked_modules: profile.unlocked_modules,
      has_full_access: profile.has_full_access,
    },
    200,
    origin,
  );
}));
