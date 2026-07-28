// /api/review.js
// Serverless Function Vercel : enregistre un avis client dans Supabase
// et envoie une notification par e-mail (à toi) via Resend.
//
// Variables d'environnement requises (les mêmes que /api/register.js) :
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY
//   RESEND_FROM_EMAIL
//   NOTIFY_ADMIN_EMAIL

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
    const { userName, userEmail, text, stars } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Avis vide.' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        nom: userName || 'Itilizatè enkoni',
        email: userEmail || null,
        text: text.trim(),
        stars: stars || 0,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Erreur Supabase (reviews):', error);
      return res.status(500).json({ error: "Erreur lors de l'enregistrement de l'avis." });
    }

    if (process.env.NOTIFY_ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.NOTIFY_ADMIN_EMAIL,
          subject: 'Nouvo avis kliyan : ' + (userName || 'Itilizatè enkoni'),
          html: `
            <div style="font-family: Arial, sans-serif;">
              <p><strong>Non:</strong> ${userName || 'Itilizatè enkoni'}</p>
              <p><strong>Imèl:</strong> ${userEmail || 'Pa disponib'}</p>
              <p><strong>Avis:</strong> ${text}</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error('Erreur envoi email Resend (review):', mailErr);
      }
    }

    return res.status(200).json({ success: true, review: data ? data[0] : null });
  } catch (err) {
    console.error('Erreur serveur /api/review:', err);
    return res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}
