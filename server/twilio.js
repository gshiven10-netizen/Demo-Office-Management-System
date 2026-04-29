const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

const makeWelcomeCall = async (toPhone, lang = 'en') => {
  if (!client) {
    console.warn('[TWILIO] Skipping call: Credentials not set in .env');
    return;
  }

  const messages = {
    en: "Thank you for registering in the app. This is a demo model made by Shiven Gupta using A.I. We have received your application and the admin will review it shortly.",
    hi: "ऐप में पंजीकरण करने के लिए धन्यवाद। यह शिवेन गुप्ता द्वारा ए.आई. का उपयोग करके बनाया गया एक डेमो मॉडल है। हमें आपका आवेदन मिल गया है और व्यवस्थापक जल्द ही इसकी समीक्षा करेंगे।",
    es: "Gracias por registrarse en la aplicación. Este es un modelo de demostración hecho por Shiven Gupta usando I.A. Hemos recibido su solicitud y el administrador la revisará pronto.",
    zh: "感谢您在应用程序中注册。这是 Shiven Gupta 使用人工智能制作的演示模型。我们已收到您的申请，管理员将很快进行审核。",
    ru: "Благодарим вас за регистрацию в приложении. Это демо-модель, созданная Шивеном Гупта с использованием ИИ. Мы получили вашу заявку, и администратор скоро ее р ассмотрит.",
    ro: "Vă mulțumim pentru înregistrarea în aplicație. Acesta este un model demonstrativ realizat de Shiven Gupta folosind A.I. Am primit cererea dvs. și administratorul o va revizui în curând."
  };

  const voices = {
    en: 'alice',
    hi: 'Google.hi-IN-Standard-A',
    es: 'alice',
    zh: 'Google.zh-CN-Standard-A',
    ru: 'Google.ru-RU-Standard-A',
    ro: 'alice'
  };

  const message = messages[lang] || messages.en;
  const voice = voices[lang] || 'alice';

  try {
    const call = await client.calls.create({
      twiml: `<Response><Say voice="${voice}">${message}</Say></Response>`,
      to: toPhone,
      from: fromPhone,
    });
    console.log(`[TWILIO] Call initiated (${lang}): ${call.sid}`);
    return call.sid;
  } catch (error) {
    console.error('[TWILIO] Error making call:', error);
  }
};

module.exports = { makeWelcomeCall };
