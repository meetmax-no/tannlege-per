// Konfigurasjon — leser env-vars og avgjør hvilke kanaler som er aktive.
// Prinsipp: tilstedeværelse av credentials = kanalen er på.
// Eksplisitt overstyring via *_ENABLED=false skrur av selv om credentials finnes.

function readEnabled(name, defaultValue = true) {
  const v = process.env[name];
  if (v === undefined || v === '') return defaultValue;
  return v.toLowerCase() !== 'false' && v !== '0';
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
      enabled: !!telegramToken && !!telegramChatId && readEnabled('TELEGRAM_ENABLED'),
      token: telegramToken,
      chatId: telegramChatId,
    },
    email: {
      enabled: !!resendKey && !!resendTo && readEnabled('EMAIL_ENABLED', false),
      apiKey: resendKey,
      from: resendFrom,
      to: resendTo,
    },
    mongo: {
      enabled: !!mongoUri && readEnabled('MONGODB_ENABLED'),
      uri: mongoUri,
      db: mongoDb,
      collection: 'contacts',
    },
  };
}
