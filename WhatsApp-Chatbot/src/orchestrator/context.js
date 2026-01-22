import db from '../db.js';

async function getContext(userId) {
  try {
    const res = await db.query(
      'SELECT context, cart, payment_method, service_type, delivery_address, number_of_people, dine_time FROM sessions WHERE user_id = $1',
      [userId]
    );

    if (res.rows.length > 0) {
      const { context, cart, payment_method, service_type, delivery_address, number_of_people, dine_time } = res.rows[0];
      // Merge distinct cart column and order details back into context object for app usage
      return {
        ...context,
        cart: cart || [],
        payment_method: payment_method || null,
        service_type: service_type || null,
        delivery_address: delivery_address || null,
        number_of_people: number_of_people || null,
        dine_time: dine_time || null
      };
    }

    // Default context
    const defaultContext = {
      stage: 'initial',
      cart: [],
      history: [],
      payment_method: null,
      service_type: null,
      delivery_address: null
    };

    // Create new session
    await db.query(
      'INSERT INTO sessions (user_id, context, cart, payment_method, service_type, delivery_address) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, defaultContext, '[]', null, null, null]
    );

    return defaultContext;
  } catch (error) {
    console.error('Error getting context:', error);
    // Fallback to memory if DB fails (prevent crash)
    return {
      stage: 'initial',
      cart: [],
      history: [],
      payment_method: null,
      service_type: null,
      delivery_address: null
    };
  }
}

async function updateContext(userId, fullContext) {
  try {
    // Separate cart and order details from the rest of the context
    const { cart, payment_method, service_type, delivery_address, number_of_people, dine_time, ...restContext } = fullContext;

    // Helper to format Date/Timestamp for PostgreSQL (if it's a Date object or ISO string)
    let formattedDineTime = dine_time;
    if (dine_time && (dine_time instanceof Date || typeof dine_time === 'string')) {
       // Ideally, let pg driver handle it, but simple check helps. Pass as is usually works for pg node driver.
       formattedDineTime = dine_time; 
    }

    await db.query(
      `INSERT INTO sessions (user_id, context, cart, payment_method, service_type, delivery_address, number_of_people, dine_time, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
       ON CONFLICT (user_id) 
       DO UPDATE SET context = $2, cart = $3, payment_method = $4, service_type = $5, delivery_address = $6, number_of_people = $7, dine_time = $8, updated_at = NOW()`,
      [userId, restContext, JSON.stringify(cart || []), payment_method || null, service_type || null, delivery_address || null, number_of_people || null, formattedDineTime || null]
    );
  } catch (error) {
    console.error('Error updating context:', error);
  }
}

export { getContext, updateContext };
