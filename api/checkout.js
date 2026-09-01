const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'JSON invalide' });
  }

  const { cart } = body || {};
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Panier vide' });
  }

  try {
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Livraison Colissimo' },
        unit_amount: 290,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: ['FR'] },
      success_url: 'https://www.feelinggoodbox.fr/success.html',
      cancel_url: 'https://www.feelinggoodbox.fr/les-boxes.html',
      locale: 'fr',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
