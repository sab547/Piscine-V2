// PDF generation service - generates report and quote documents
// Returns the PDFDocument object that can be saved or streamed

export async function generateRapportPDFDocument(
  piscineNom: string,
  piscineAdresse: string,
  technicienName: string,
  photoBefore: string | undefined,
  photoAfter: string | undefined,
  ph: number | undefined,
  chlore: number | undefined,
  temperature: number | undefined
) {
  // Returns PDF document data as string
  // In production, use @react-pdf/renderer:
  // const doc = new Document({ ... });
  // const stream = await pdf(doc).toStream();

  const norms = {
    ph: { min: 7.0, max: 7.6 },
    chlore: { min: 1.0, max: 3.0 },
    temperature: { min: 24, max: 28 },
  };

  const isPhOk = ph && ph >= norms.ph.min && ph <= norms.ph.max;
  const isChloOk = chlore && chlore >= norms.chlore.min && chlore <= norms.chlore.max;
  const isTempOk = temperature && temperature >= norms.temperature.min && temperature <= norms.temperature.max;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Rapport d'intervention - ${piscineNom}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #0B5EA8; border-bottom: 2px solid #0B5EA8; padding-bottom: 10px; }
          h2 { color: #083F74; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #E2E8F0; padding: 10px; text-align: left; }
          th { background-color: #F4F6FA; font-weight: bold; }
          .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
          .ok { background-color: #D1FAE5; color: #059669; }
          .alert { background-color: #FEE2E2; color: #DC2626; }
        </style>
      </head>
      <body>
        <h1>Rapport d'intervention</h1>
        <p><strong>Piscine :</strong> ${piscineNom}</p>
        <p><strong>Adresse :</strong> ${piscineAdresse}</p>

        <h2>Informations d'intervention</h2>
        <p><strong>Technicien :</strong> ${technicienName}</p>
        <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure :</strong> ${new Date().toLocaleTimeString('fr-FR')}</p>

        <h2>Mesures de qualité de l'eau</h2>
        <table>
          <tr>
            <th>Paramètre</th>
            <th>Valeur</th>
            <th>Norme</th>
            <th>Statut</th>
          </tr>
          <tr>
            <td>pH</td>
            <td>${ph ?? '-'}</td>
            <td>${norms.ph.min}-${norms.ph.max}</td>
            <td>${ph !== undefined ? `<span class="badge ${isPhOk ? 'ok' : 'alert'}">${isPhOk ? 'OK' : 'ALERTE'}</span>` : '-'}</td>
          </tr>
          <tr>
            <td>Chlore (ppm)</td>
            <td>${chlore ?? '-'}</td>
            <td>${norms.chlore.min}-${norms.chlore.max}</td>
            <td>${chlore !== undefined ? `<span class="badge ${isChloOk ? 'ok' : 'alert'}">${isChloOk ? 'OK' : 'ALERTE'}</span>` : '-'}</td>
          </tr>
          <tr>
            <td>Température (°C)</td>
            <td>${temperature ?? '-'}</td>
            <td>${norms.temperature.min}-${norms.temperature.max}</td>
            <td>${temperature !== undefined ? `<span class="badge ${isTempOk ? 'ok' : 'alert'}">${isTempOk ? 'OK' : 'ALERTE'}</span>` : '-'}</td>
          </tr>
        </table>

        <p style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #E2E8F0; color: #64748B; font-size: 12px;">
          Ce rapport a été généré par PoolTrack - ${new Date().getFullYear()}
        </p>
      </body>
    </html>
  `;

  return htmlContent;
}

export async function generateDevisPDFDocument(
  devisNumero: string,
  proprietaireName: string,
  proprietaireEmail: string,
  montantHT: number,
  tva: number,
  description: string
) {
  const montantTVA = (montantHT * tva) / 100;
  const montantTTC = montantHT + montantTVA;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Devis ${devisNumero}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #0B5EA8; border-bottom: 2px solid #0B5EA8; padding-bottom: 10px; }
          h2 { color: #083F74; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #E2E8F0; padding: 10px; text-align: left; }
          th { background-color: #F4F6FA; font-weight: bold; }
          .total { background-color: #F4F6FA; font-weight: bold; }
          .signature-area { height: 100px; border: 2px dashed #E2E8F0; margin-top: 50px; }
        </style>
      </head>
      <body>
        <h1>Devis</h1>
        <p><strong>Numéro :</strong> ${devisNumero}</p>
        <p><strong>Valable :</strong> 30 jours</p>

        <h2>Informations du client</h2>
        <p><strong>Nom :</strong> ${proprietaireName}</p>
        <p><strong>Email :</strong> ${proprietaireEmail}</p>
        <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>

        <h2>Travaux à effectuer</h2>
        <p>${description}</p>

        <h2>Tarification</h2>
        <table>
          <tr>
            <th>Description</th>
            <th>Montant</th>
          </tr>
          <tr>
            <td>${description}</td>
            <td>${montantHT.toFixed(2)}€</td>
          </tr>
          <tr>
            <td>TVA (${tva}%)</td>
            <td>${montantTVA.toFixed(2)}€</td>
          </tr>
          <tr class="total">
            <td>Total TTC</td>
            <td>${montantTTC.toFixed(2)}€</td>
          </tr>
        </table>

        <div class="signature-area">
          <p style="margin-top: 10px; font-size: 12px;">Signature du client</p>
        </div>

        <p style="margin-top: 50px; color: #64748B; font-size: 12px;">
          Ce devis a été généré par PoolTrack. Pour accepter, veuillez le signer en ligne via le lien reçu par email.
        </p>
      </body>
    </html>
  `;

  return htmlContent;
}
