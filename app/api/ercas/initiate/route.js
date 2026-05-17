export async function POST(req) {
  try {
    const body = await req.json()

    console.log('🔵 Initiating Ercas payment...')
    console.log('💰 Amount:', body.amount)
    console.log('👤 Customer:', body.name, body.email)

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
          paymentReference: `JIX-${Date.now()}`,
          paymentMethods: 'card,bank-transfer,ussd',
          customerName: body.name,
          customerEmail: body.email,
          customerPhoneNumber: body.phone,
          currency: 'NGN',
          redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success`,
          description: 'JIX Accessories Payment',
          metadata: {
            customerName: body.name,
          },
        }),
      }
    )

    const data = await response.json()

    console.log('📊 Ercas Response:', data)

    if (!data.requestSuccessful) {
      console.error('❌ Ercas Error:', data)
      return Response.json({
        success: false,
        message: 
        data.errorMessage || 
        data.responseMessage || 
        'Payment initialization failed',
      })
    }

    console.log('✅ Payment initialized successfully')
    console.log('🔗 Checkout URL:', data.responseBody.checkoutUrl)

    return Response.json({
      success: true,
      checkoutUrl: data.responseBody.checkoutUrl,
      transactionReference: data.responseBody.transactionReference,
    })
  } catch (error) {
    console.error('🚨 Server Error:', error)
    return Response.json({
      success: false,
      message: 'Server error. Please try again.',
    })
  }
}