// src/userName.js
// A megjelenítendő felhasználónév kiválasztása. A különböző belépési módok
// (email+jelszó, Google, Spotify) más-más mezőbe teszik a nevet, ezért
// sorban végigmegyünk a lehetséges helyeken.
export function getDisplayName(user) {
  if (!user) return null;

  const meta = user.user_metadata || {};
  const identityData =
    (user.identities || []).find((i) => i && i.identity_data)?.identity_data || {};

  return (
    meta.username ||
    meta.display_name ||
    meta.full_name ||
    meta.name ||
    meta.preferred_username ||
    identityData.display_name ||
    identityData.full_name ||
    identityData.name ||
    user.email ||
    identityData.email ||
    "Vibemotion user"
  );
}
