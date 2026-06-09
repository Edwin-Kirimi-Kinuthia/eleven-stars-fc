import { NextRequest, NextResponse } from 'next/server'

const DARAJA_BASE = 'https://sandbox.safaricom.co.ke' // switch to api.safaricom.co.ke for production
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY ?? ''
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET ?? ''
const SHORTCODE = process.env.MPESA_SHORTCODE ?? ''      // Absa Paybill number
const PASSKEY = process.env.MPESA_PASSKEY ?? ''
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL ?? ''

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
  const res = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  })
  if (!res.ok) throw new Error('Failed to get Daraja access token')
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, description } = await req.json()

    if (!phone || !amount) {
      return NextResponse.json({ error: 'Phone and amount are required' }, { status: 400 })
    }

    // Return mock success in dev when credentials are not yet set
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
      return NextResponse.json({
        success: true,
        message: 'STK Push sent (dev mode — add real credentials in .env.local)',
        CheckoutRequestID: 'dev-mock-id',
      })
    }

    const accessToken = await getAccessToken()
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14)
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64')

    const stkRes = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: phone,
        PartyB: SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: 'ElevenStarsFC',
        TransactionDesc: description,
      }),
    })

    const stkData = await stkRes.json()

    if (stkData.ResponseCode !== '0') {
      return NextResponse.json({ error: stkData.ResponseDescription ?? 'STK Push failed' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      CheckoutRequestID: stkData.CheckoutRequestID,
      message: 'STK Push sent to phone',
    })
  } catch (err: unknown) {
    console.error('STK Push error:', err)
    return NextResponse.json({ error: 'Payment request failed. Please try again.' }, { status: 500 })
  }
}
