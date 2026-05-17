export async function POST(req) {
  try {
    const body = await req.json()

    if (!body.amount || !body.email || !body.name) {
      return Response.json({
        success: false,
        message: 'Missing required fields',
      })
    }

    const orderId = body.orderId || `JIX-${Date.now()}`

    console.log('🔵 Initiating Ercas payment...')
    console.log('Order ID:', orderId)

    const response = await fetch(
      'https://api.ercaspay.com/api/v1/payment/initiate',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ERCAS_SECRET_KEY}`,
        },
        body: JSON.stringify({
          amount: body.amount,
          paymentReference: orderId,
          paymentMethods: 'card,bank-transfer,ussd',
          customerName: body.name,
          customerEmail: body.email,
          customerPhoneNumber: body.phone,
          currency: 'NGN',
          redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}`,
          description: 'JIX Accessories Payment',
        }),
      }
    )

    const data = await response.json()

    console.log('📊 Ercas Response:', data)

    if (!data.requestSuccessful) {
      return Response.json({
        success: false,
        message: data.responseMessage || 'Payment failed',
      })
    }

    return Response.json({
      success: true,
      checkoutUrl: data.responseBody.checkoutUrl,
    })

  } catch (error) {
    console.error('🚨 Server Error:', error)

    return Response.json({
      success: false,
      message: 'Server error. Please try again.',
    })
  }
}