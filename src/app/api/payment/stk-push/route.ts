import { NextResponse } from 'next/server'

interface StkPushRequest {
  phoneNumber: string
  amount: number
  description: string
}

export async function POST(request: Request) {
  try {
    const body: StkPushRequest = await request.json()

    // Validate input
    if (!body.phoneNumber || !body.amount) {
      return NextResponse.json(
        { error: 'Phone number and amount are required' },
        { status: 400 }
      )
    }

    // Get Safaricom credentials from env
    const consumerKey = process.env.NEXT_PUBLIC_SAFARICOM_CONSUMER_KEY
    const consumerSecret = process.env.SAFARICOM_CONSUMER_SECRET
    const shortCode = process.env.SAFARICOM_SHORTCODE || '174379'
    const passkey = process.env.SAFARICOM_PASSKEY
    const callbackUrl = process.env.SAFARICOM_CALLBACK_URL

    if (!consumerKey || !consumerSecret || !passkey || !callbackUrl) {
      console.error('Missing Safaricom configuration')
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      )
    }

    // Get access token from Safaricom Daraja API
    const auth = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64')

    const tokenResponse = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        method: 'GET',
        headers: { Authorization: `Basic ${auth}` },
      }
    )

    if (!tokenResponse.ok) {
      console.error('Failed to get Safaricom token')
      return NextResponse.json(
        { error: 'Failed to initiate payment' },
        { status: 500 }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Prepare STK Push request
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '')
    const password = Buffer.from(
      `${shortCode}${passkey}${timestamp}`
    ).toString('base64')

    const stkResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: body.amount,
          PartyA: body.phoneNumber,
          PartyB: shortCode,
          PhoneNumber: body.phoneNumber,
          CallBackURL: callbackUrl,
          AccountReference: 'ELEVEN_STARS',
          TransactionDesc: body.description,
        }),
      }
    )

    if (!stkResponse.ok) {
      console.error('STK Push failed:', await stkResponse.text())
      return NextResponse.json(
        { error: 'Failed to send payment prompt' },
        { status: 500 }
      )
    }

    const stkData = await stkResponse.json()

    return NextResponse.json({
      success: true,
      checkoutRequestID: stkData.CheckoutRequestID,
      responseCode: stkData.ResponseCode,
      message: 'STK Push sent successfully',
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
