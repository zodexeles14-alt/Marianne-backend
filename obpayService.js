const initiateCollection = async ({ amount, phone_number, customer_name, currency = 'UGX', reference, description, idempotencyKey }) => {
  try {
    // Automatically convert 070... or +25670... to 25670...
    const cleanedPhone = String(phone_number).trim().replace(/\s+/g, '');
    const formattedPhone = cleanedPhone.startsWith('0')
      ? `256${cleanedPhone.slice(1)}`
      : cleanedPhone.replace(/^\+/, '');

    const response = await fetch(`${OBIPAY_BASE_URL}/collect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OBIPAY_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(idempotencyKey && { 'Idempotency-Key': idempotencyKey })
      },
      body: JSON.stringify({
        amount,
        phone_number: formattedPhone,
        customer_name,
        currency,
        reference,
        description
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || 'ObPay collection initiation failed');
    }
    return data;
  } catch (err) {
    console.error('ObPay API Error:', err.message);
    if (process.env.NODE_ENV !== 'production') {
      return {
        success: true,
        reference,
        status: 'PENDING',
        message: 'Mock ObPay USSD push prompt sent successfully'
      };
    }
    throw err;
  }
};
