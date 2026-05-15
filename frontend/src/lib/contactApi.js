// Klient-side hjelper for å sende kontaktskjema til /api/contact.
// Returnerer { ok, error, code }.

export async function submitContact(data) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: json.error || 'Noe gikk galt. Prøv igjen eller ring oss.',
        code: json.code || 'HTTP_ERROR',
        status: res.status,
      };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: 'Mistet kontakt med serveren. Sjekk nettet og prøv igjen.',
      code: 'NETWORK_ERROR',
    };
  }
}
