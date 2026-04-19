# Apple & Google Wallet — Setup Guide

The loyalty card can be saved to Apple Wallet or Google Wallet so customers can open their stamp card from the lock screen and get **location-based reminders** when they're near a Coffee Christopher location.

Both wallets need a one-time credentials setup. Without credentials the server routes respond with `501 Not Implemented` and a helpful setup hint, and the frontend buttons are hidden — everything else in the app keeps working.

---

## Apple Wallet (`.pkpass`)

### What you need
1. An **Apple Developer Account** — $99/year.
2. A **Pass Type ID** (Certificates, Identifiers & Profiles → Identifiers → Pass Type IDs).
3. A **Pass Type ID certificate** exported as `.p12`.
4. The **Apple WWDR (Worldwide Developer Relations) certificate** from Apple's PKI page.

### Environment variables
Add to `server/.env`:

```env
APPLE_PASS_CERT_P12=/absolute/path/to/pass.p12
APPLE_PASS_CERT_PASSWORD=your-p12-password
APPLE_PASS_TYPE_ID=pass.com.coffeechristopher.loyalty
APPLE_TEAM_ID=ABCDE12345
APPLE_WWDR_CERT=/absolute/path/to/AppleWWDRCAG4.cer
```

### Install the generator
```bash
cd server
npm install passkit-generator
```

### Finish the route
In `server/routes/loyalty.js`, inside `GET /:qrCode/apple-wallet`, replace the stub with:

```js
const { PKPass } = require('passkit-generator');
const pass = await PKPass.from({
  model: './wallet/cc-loyalty.pass',
  certificates: {
    wwdr: process.env.APPLE_WWDR_CERT,
    signerCert: process.env.APPLE_PASS_CERT_P12,
    signerKey: process.env.APPLE_PASS_CERT_P12,
    signerKeyPassphrase: process.env.APPLE_PASS_CERT_PASSWORD,
  },
}, {
  serialNumber: customer.qr_code,
  description: 'Coffee Christopher Loyalty',
  organizationName: 'Coffee Christopher',
  passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID,
  teamIdentifier: process.env.APPLE_TEAM_ID,
});
pass.headerFields.push({ key: 'stamps', label: 'STAMPS', value: String(customer.stamps) });
pass.setBarcodes({ message: customer.qr_code, format: 'PKBarcodeFormatQR' });
// Location reminders — add each shop here (lat, lng, optional relevantText)
pass.locations.push({ latitude: 26.0112, longitude: -80.1495, relevantText: '☕ Your stamp card is ready!' });
res.type('application/vnd.apple.pkpass').send(pass.getAsBuffer());
```

The `pass.locations` array is what triggers the lock-screen reminder when the phone enters a ~100m radius around one of your shops.

---

## Google Wallet (`Save to Google Wallet`)

### What you need
1. A **Google Cloud project** with the Wallet API enabled.
2. A **Service Account** with the role `Wallet Object Issuer`.
3. A **Wallet Issuer ID** from the Wallet API console.
4. Download the service account JSON key.

### Environment variables
```env
GOOGLE_WALLET_SERVICE_ACCOUNT=/absolute/path/to/service-account.json
GOOGLE_WALLET_ISSUER_ID=3388000000012345678
GOOGLE_WALLET_CLASS_ID=3388000000012345678.coffeechristopher_loyalty
```

### Install the JWT signer
```bash
cd server
npm install google-auth-library
```

### Finish the route
In `server/routes/loyalty.js`, inside `GET /:qrCode/google-wallet`, replace the stub with:

```js
const { GoogleAuth } = require('google-auth-library');
const auth = new GoogleAuth({
  keyFile: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
});

const loyaltyObject = {
  id: `${process.env.GOOGLE_WALLET_ISSUER_ID}.${customer.qr_code}`,
  classId: process.env.GOOGLE_WALLET_CLASS_ID,
  state: 'ACTIVE',
  accountName: `${customer.first_name} ${customer.last_name}`,
  accountId: customer.qr_code,
  loyaltyPoints: { label: 'Stamps', balance: { int: customer.stamps } },
  barcode: { type: 'QR_CODE', value: customer.qr_code },
  // Location reminders — one entry per shop
  locations: [{ latitude: 26.0112, longitude: -80.1495 }],
};

const claims = {
  iss: (await auth.getCredentials()).client_email,
  aud: 'google',
  typ: 'savetowallet',
  origins: [process.env.CLIENT_URL],
  payload: { loyaltyObjects: [loyaltyObject] },
};

const client = await auth.getClient();
const jwt = await client.sign(JSON.stringify(claims));
res.redirect(`https://pay.google.com/gp/v/save/${jwt}`);
```

---

## Weekly reminder — optional extra

If you want the weekly "come back and use your stamps!" email to actually send automatically instead of opening a `mailto:` batch:

1. Create a free [SendGrid](https://sendgrid.com/) or [Resend](https://resend.com/) account.
2. Add to `server/.env`:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=rewards@coffeechristopher.com
   ```
3. Install: `npm install @sendgrid/mail`
4. In `server/routes/loyalty.js`, inside `POST /admin/reminders/weekly`, add:
   ```js
   const sg = require('@sendgrid/mail');
   sg.setApiKey(process.env.SENDGRID_API_KEY);
   await sg.send(customers.map((c) => ({
     to: c.email,
     from: process.env.SENDGRID_FROM_EMAIL,
     subject: '☕ Your Coffee Christopher stamps are waiting',
     text: `Hi ${c.first_name} — you have ${c.stamps} stamps. Come by and earn a free drink!`,
   })));
   ```
5. Schedule it with a free cron — Vercel Cron, Railway Cron, or GitHub Actions — hitting `POST /api/loyalty/admin/reminders/weekly` once a week with an admin JWT.
