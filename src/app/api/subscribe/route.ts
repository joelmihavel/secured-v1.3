import { NextResponse } from 'next/server'
import { handleNotificationRequest } from '@/lib/hubspot-server'
import { z } from 'zod'

const subscribeSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  name: z.string().optional(),
  notification_type: z.enum(['specific room', 'specific home', 'all homes', 'upcoming home']),
  property_id: z.string().optional(),
  property_name: z.string().optional(),
  room_id: z.string().optional(),
}).refine((data) => data.phone || data.email, {
  message: "Either phone or email is required",
  path: ["phone", "email"],
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { phone, email, name, notification_type, property_id, property_name, room_id } = result.data

    await handleNotificationRequest({
      phone,
      email,
      name,
      notification_type,
      property_id,
      property_name,
      room_id,
    })

    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
