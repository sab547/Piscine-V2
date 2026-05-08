import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRapportEmail(
  proprietaireEmail: string,
  piscineNom: string,
  magicLink: string,
  technicienName: string = 'Votre technicien'
) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'rapport@pooltrack.fr',
      to: proprietaireEmail,
      subject: `Rapport d'intervention - ${piscineNom}`,
      html: `
        <h2>Rapport d'intervention - ${piscineNom}</h2>
        <p>Bonjour,</p>
        <p>${technicienName} a réalisé une intervention sur votre piscine.</p>
        <p>Consultez le rapport détaillé avec photos et mesures :</p>
        <a href="${magicLink}" style="background: #0B5EA8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Voir le rapport
        </a>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          Ce lien expire dans 7 jours.
        </p>
      `,
    });

    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendReminderEmail(
  proprietaireEmail: string,
  piscineNom: string,
  daysSinceLastVisit: number
) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'rappels@pooltrack.fr',
      to: proprietaireEmail,
      subject: `Rappel d'entretien - ${piscineNom}`,
      html: `
        <h2>Rappel d'entretien - ${piscineNom}</h2>
        <p>Bonjour,</p>
        <p>Nous remarquons qu'aucune intervention n'a été effectuée depuis ${daysSinceLastVisit} jours.</p>
        <p>L'entretien régulier de votre piscine est important pour :</p>
        <ul>
          <li>Maintenir la qualité de l'eau</li>
          <li>Prévenir les problèmes d'algues</li>
          <li>Prolonger la durée de vie de votre équipement</li>
        </ul>
        <p>N'hésitez pas à contacter votre pisciniste pour programmer une intervention.</p>
      `,
    });

    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Reminder email sending failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendDevisEmail(
  proprietaireEmail: string,
  devisNumero: string,
  montantTTC: number,
  magicLink: string
) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'devis@pooltrack.fr',
      to: proprietaireEmail,
      subject: `Devis ${devisNumero} - À signer`,
      html: `
        <h2>Devis ${devisNumero}</h2>
        <p>Bonjour,</p>
        <p>Un nouveau devis est disponible pour votre piscine.</p>
        <p><strong>Montant TTC :</strong> ${montantTTC}€</p>
        <p>Consultez et signez votre devis :</p>
        <a href="${magicLink}" style="background: #0B5EA8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Voir et signer le devis
        </a>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          Ce devis expire dans 30 jours.
        </p>
      `,
    });

    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Devis email sending failed:', error);
    return { success: false, error: String(error) };
  }
}
