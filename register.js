// /api/register.js
// Serverless Function Vercel : enregistre le profil utilisateur dans Supabase
// et envoie un e-mail de confirmation automatique via Resend.
//
// Variables d'environnement requises (à définir sur le dashboard Vercel) :
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY
//   RESEND_FROM_EMAIL      (ex: "LCDrop <onboarding@tondomaine.com>")
//   NOTIFY_ADMIN_EMAIL     (optionnel — ton adresse pour être notifié)

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { nom, email, phone, address, reference, whatsapp_referant, uid } = req.body || {};

    if (!nom || !email || !address || !reference) {
      return res.status(400).json({ error: 'Champs obligatoires manquants (nom, email, address, reference).' });
    }

    // 1. Enregistrement / mise à jour dans Supabase (upsert sur l'email)
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          uid: uid || null,
          nom,
          email,
          phone: phone || null,
          address,
          reference,
          whatsapp_referant: whatsapp_referant || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: "Erreur lors de l'enregistrement en base de données." });
    }

    // 2. Envoi de l'e-mail de confirmation au client
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: 'Konfimasyon enskripsyon ou - LCDrop',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
            <h2>Byenveni, ${nom} !</h2>
            <p>Pwofil ou anrejistre ak siksè sou LCDrop.</p>
            <ul>
              <li><strong>Non:</strong> ${nom}</li>
              <li><strong>Imèl:</strong> ${email}</li>
              <li><strong>Telefòn:</strong> ${phone || 'Pa presize'}</li>
              <li><strong>Adrès:</strong> ${address}</li>
            </ul>
            <p>Mèsi pou konfyans ou !</p>
          </div>
        `,
      });
    } catch (mailErr) {
      // On ne bloque pas la réponse si l'email échoue : la donnée est déjà sauvegardée.
      console.error('Erreur envoi email Resend:', mailErr);
    }

    // 3. Notification interne optionnelle (à toi)
    if (process.env.NOTIFY_ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.NOTIFY_ADMIN_EMAIL,
          subject: 'Nouvo pwofil / mizajou: ' + nom,
          html: `<p>Nouvo enskripsyon oswa mizajou pwofil pou <strong>${nom}</strong> (${email}).</p>`,
        });
      } catch (e) { console.error('Erreur notification admin:', e); }
    }

    return res.status(200).json({ success: true, user: data ? data[0] : null });
  } catch (err) {
    console.error('Erreur serveur /api/register:', err);
    return res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}
