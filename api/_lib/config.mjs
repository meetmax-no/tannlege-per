// Konfigurasjon — leser env-vars og avgjør hvilke kanaler som er aktive.
// Prinsipp: HVER kanal må eksplisitt aktiveres via *_ENABLED=true.
// Mangler den, eller er den noe annet enn "true", er kanalen AV — uavhengig av
// om credentials finnes. Ingen skjulte fallbacks.

function isTrue(name) {
  const v = process.env[name];
  return typeof v === 'string' && v.trim().toLowerCase() === 'true';
}

export function getNotificationConfig() {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const telegramChatId = process.env.TELEGRAM_CHAT_ID || '';
  const resendKey = process.env.RESEND_API_KEY || '';
  const resendFrom = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const resendTo = process.env.RESEND_TO_EMAIL || '';
  const mongoUri = process.env.MONGODB_URI || '';
  const mongoDb = process.env.MONGODB_DB || 'tannlege-per';

  return {
    telegram: {
      enabled: isTrue('TELEGRAM_ENABLED') && !!telegramToken && !!telegramChatId,
      token: telegramToken,
      chatId: telegramChatId,
    },
    email: {
      enabled: isTrue('EMAIL_ENABLED') && !!resendKey && !!resendTo,
      apiKey: resendKey,
      from: resendFrom,
      to: resendTo,
    },
    mongo: {
      enabled: isTrue('MONGODB_ENABLED') && !!mongoUri,
      uri: mongoUri,
      db: mongoDb,
      collection: 'contacts',
    },
  };
}
