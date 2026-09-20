import { HttpError } from "./academy-core.ts";

export function assertClientAnalyticsEvent(
  pixel: unknown,
  event: unknown,
): void {
  // Canonical string IDs prevent numeric coercion or URL encoding from bypassing
  // the Academy Purchase restriction in the public analytics endpoint.
  if (
    typeof pixel !== "string" || !/^[1-9]\d{5,24}$/.test(pixel) ||
    typeof event !== "string" || !event
  ) {
    throw new HttpError(400, "Invalid pixel_id or event_name");
  }
  if (event === "Purchase" && pixel === "1742675203594120") {
    throw new HttpError(403, "Use the verified purchase pipeline");
  }
}
