const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const escapeAttr = (s) => escapeHtml(s).replace(/`/g, '&#096;');

export const emailTemplates = {
  welcome: (firstName, confirmationLink) => {
    const name = escapeHtml(firstName || '👋');
    const link = escapeAttr(confirmationLink || '');

    const year = new Date().getFullYear();

    // ⚠️ Mets tes vrais liens
    const SUPPORT_URL = 'https://cleavenir.com/support';
    const FAQ_URL = 'https://cleavenir.com/faq';
    const UNSUB_URL = 'https://cleavenir.com/unsubscribe';

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bienvenue sur CléAvenir</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;">
  <!-- Preheader (texte caché qui s'affiche en aperçu) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Confirme ton email et découvre tes métiers en quelques minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f8fafc;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding:24px;border-bottom:1px solid #e2e8f0;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="vertical-align:middle;">
                    <img
                      src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/d8ca901e80d017ffe3233aaf1581909b.png"
                      width="40" height="40"
                      alt="CléAvenir"
                      style="display:block;border:0;outline:none;text-decoration:none;"
                    />
                  </td>
                  <td style="vertical-align:middle;padding-left:10px;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:800;color:#0f172a;">
                    CléAvenir
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 24px;font-family:Helvetica,Arial,sans-serif;color:#334155;">
              <h1 style="margin:0 0 8px 0;font-size:24px;line-height:1.2;font-weight:800;color:#0f172a;">
                Bienvenue, ${name} !
              </h1>
              <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#64748b;">
                Ton compte est créé. Prêt à découvrir tes métiers ?
              </p>

              <p style="margin:0 0 18px 0;font-size:14px;line-height:1.7;">
                Tu as rejoint CléAvenir, la plateforme d’orientation qui te comprend vraiment.
                En quelques minutes, tu vas découvrir les métiers qui te correspondent grâce à notre IA.
              </p>

              <!-- Bulletproof button (compatible Outlook) -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:24px auto;">
                <tr>
                  <td align="center" bgcolor="#2563eb" style="border-radius:999px;">
                    <a href="${link}"
                      style="display:inline-block;padding:14px 28px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">
                      Confirmer mon email et commencer
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Steps box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f8fafc;border-radius:12px;">
                <tr>
                  <td style="padding:18px 16px;">
                    <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:800;color:#0f172a;">
                      Prochaines étapes :
                    </h3>

                    ${[
                      'Confirme ton email',
                      "Fais le test d’orientation (5 min)",
                      'Découvre tes métiers compatibles',
                      'Accède à ton plan d’action',
                    ].map((txt, idx) => `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:10px;">
                        <tr>
                          <td width="28" valign="top" style="font-family:Helvetica,Arial,sans-serif;">
                            <div style="width:24px;height:24px;line-height:24px;text-align:center;background:#e0e7ff;color:#4338ca;border-radius:999px;font-size:12px;font-weight:800;">
                              ${idx + 1}
                            </div>
                          </td>
                          <td valign="top" style="padding-left:10px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#0f172a;">
                            ${escapeHtml(txt)}
                          </td>
                        </tr>
                      </table>
                    `).join('')}

                  </td>
                </tr>
              </table>

              <p style="margin:18px 0 0 0;font-size:12px;line-height:1.6;color:#64748b;">
                Si le bouton ne fonctionne pas, copie/colle ce lien :
                <br />
                <a href="${link}" style="color:#2563eb;text-decoration:underline;word-break:break-all;">
                  ${link}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9;padding:20px 24px;text-align:center;font-family:Helvetica,Arial,sans-serif;">
              <p style="margin:0 0 10px 0;font-size:12px;color:#334155;">
                <strong>CléAvenir</strong><br/>
                L’orientation intelligente pour tous.
              </p>
              <p style="margin:0;font-size:12px;">
                <a href="${SUPPORT_URL}" style="color:#64748b;text-decoration:none;">Support</a>
                &nbsp;•&nbsp;
                <a href="${FAQ_URL}" style="color:#64748b;text-decoration:none;">FAQ</a>
                &nbsp;•&nbsp;
                <a href="${UNSUB_URL}" style="color:#64748b;text-decoration:none;">Se désinscrire</a>
              </p>
              <p style="margin:12px 0 0 0;font-size:12px;color:#94a3b8;">
                © ${year} CléAvenir. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
  }
};