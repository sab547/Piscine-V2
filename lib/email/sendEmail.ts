// Email service - TODO: integrate with Resend API in production
// For now, returns mock responses for development/testing
// Production: Install 'resend' package and use ResendClient

export async function sendRapportEmail(
  proprietaireEmail: string,
  piscineNom: string,
  magicLink: string,
  technicienName: string = 'Votre technicien'
) {
  console.log(`[Email] Sending rapport to ${proprietaireEmail} for ${piscineNom}`);

  // TODO: Uncomment when Resend is integrated
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // const result = await resend.emails.send({...});

  return { success: true, messageId: `mock-rapport-${Date.now()}` };
}

export async function sendReminderEmail(
  proprietaireEmail: string,
  piscineNom: string,
  daysSinceLastVisit: number
) {
  console.log(`[Email] Sending reminder to ${proprietaireEmail} for ${piscineNom} (${daysSinceLastVisit} days since visit)`);

  // TODO: Uncomment when Resend is integrated
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // const result = await resend.emails.send({...});

  return { success: true, messageId: `mock-reminder-${Date.now()}` };
}

export async function sendDevisEmail(
  proprietaireEmail: string,
  devisNumero: string,
  montantTTC: number,
  magicLink: string
) {
  console.log(`[Email] Sending devis ${devisNumero} (${montantTTC}€) to ${proprietaireEmail}`);

  // TODO: Uncomment when Resend is integrated
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // const result = await resend.emails.send({...});

  return { success: true, messageId: `mock-devis-${Date.now()}` };
}
