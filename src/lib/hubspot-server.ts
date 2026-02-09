import { Client } from '@hubspot/api-client'

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN })

export interface NotificationRequestData {
  phone?: string
  email?: string
  name?: string
  notification_type: 'specific room' | 'specific home' | 'all homes' | 'upcoming home'
  property_id?: string
  property_name?: string
  room_id?: string
}

// Helper function to ensure phone has +91 prefix
function formatPhoneWithCountryCode(phone: string): string {
  // Remove any existing + or country code prefix
  let cleanPhone = phone.replace(/^\+91/, '').replace(/^\+/, '').trim()
  // Remove spaces, dashes, parentheses
  cleanPhone = cleanPhone.replace(/[\s\-()]/g, '')
  // Add +91 prefix
  return `+91${cleanPhone}`
}

export async function handleNotificationRequest(data: NotificationRequestData) {
  try {
    // Check if token is loaded
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
      throw new Error('HUBSPOT_ACCESS_TOKEN is not set in environment variables')
    }

    if (!data.phone && !data.email) {
      throw new Error('Either phone or email is required')
    }

    let contactId: string
    let formattedPhone: string | undefined
    let email: string | undefined

    // 1. Get or Create Contact (by phone or email depending on notification type)
    if (data.notification_type === 'all homes') {
      // For "all homes", use email
      if (!data.email) {
        throw new Error('Email is required for "all homes" notifications')
      }
      email = data.email.trim().toLowerCase()
      console.log('📧 Using email:', email)
      console.log('👤 Getting or creating contact by email...')
      contactId = await getOrCreateContactByEmail(email)
    } else {
      // For other notification types, use phone
      if (!data.phone) {
        throw new Error('Phone is required for this notification type')
      }
      formattedPhone = formatPhoneWithCountryCode(data.phone)
      console.log('📞 Formatted phone:', formattedPhone)
      console.log('👤 Getting or creating contact by phone...')
      contactId = await getOrCreateContactByPhone(formattedPhone, data.name)
    }
    console.log('✅ Contact ID:', contactId)

    // 2. Fire Custom Event to HubSpot
    if (data.notification_type === 'specific room' || data.notification_type === 'specific home') {
      console.log('🎯 Firing custom event for PDP notification...')
      await fireCustomEvent(contactId, data, formattedPhone!)
    } else if (data.notification_type === 'upcoming home') {
      console.log('🎯 Firing custom event for upcoming home notification...')
      await fireUpcomingHomeEvent(contactId, data, formattedPhone!)
    } else if (data.notification_type === 'all homes') {
      console.log('🎯 Firing custom event for all homes notification...')
      await fireAllHomesEvent(contactId, data, email!)
    } else {
      console.log('⏭️  Skipping custom event (unknown notification type)')
    }

    return { success: true, contactId }
  } catch (error: any) {
    console.error('❌ Error handling notification request:', error)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    throw error
  }
}

async function getOrCreateContactByPhone(phone: string, name?: string): Promise<string> {
  const publicObjectSearchRequest = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'phone',
            operator: 'EQ' as any,
            value: phone,
          },
        ],
      },
    ],
    sorts: ['createdate'],
    properties: ['firstname', 'lastname', 'phone', 'hs_lead_status'],
    limit: 1,
  }

  try {
    console.log('🔍 Searching for contact with phone:', phone)
    const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch(
      publicObjectSearchRequest
    )

    if (searchResponse.total > 0) {
      const existingContact = searchResponse.results[0]
      // Prepare update properties
      const updateProperties: Record<string, string> = {}
      
      // If name provided and contact doesn't have a name, update it
      if (name && !existingContact.properties?.firstname) {
        const nameParts = name.trim().split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        updateProperties.firstname = firstName
        updateProperties.lastname = lastName
      }
      
      // Always update lead status to "Qualified" for notification subscriptions
      if (!existingContact.properties?.hs_lead_status || existingContact.properties?.hs_lead_status !== 'Qualified') {
        updateProperties.hs_lead_status = 'Qualified'
      }
      
      // Update contact if there are any properties to update
      if (Object.keys(updateProperties).length > 0) {
        await hubspotClient.crm.contacts.basicApi.update(existingContact.id, {
          properties: updateProperties,
        })
        console.log('✅ Updated contact properties:', updateProperties)
      }
      
      console.log('✅ Found existing contact:', existingContact.id)
      return existingContact.id
    }

    // Create new contact with formatted phone and name
    console.log('➕ Creating new contact...')
    const nameParts = name ? name.trim().split(' ') : []
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    const createContactRequest = {
      properties: {
        phone: phone,
        hs_lead_status: 'Qualified',
        ...(firstName && { firstname: firstName }),
        ...(lastName && { lastname: lastName }),
      },
    }

    const createResponse = await hubspotClient.crm.contacts.basicApi.create(
      createContactRequest
    )
    console.log('✅ Created new contact:', createResponse.id)
    return createResponse.id
  } catch (e: any) {
    console.error('❌ Error in getOrCreateContactByPhone:', e?.message)
    if (e.message === 'HTTP request failed') {
      console.error('Full error response:', JSON.stringify(e.response, null, 2))
    }
    if (e.body) {
      console.error('Error body:', JSON.stringify(e.body, null, 2))
    }
    throw e
  }
}

async function getOrCreateContactByEmail(email: string): Promise<string> {
  const publicObjectSearchRequest = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'email',
            operator: 'EQ' as any,
            value: email,
          },
        ],
      },
    ],
    sorts: ['createdate'],
    properties: ['firstname', 'lastname', 'email', 'hs_lead_status'],
    limit: 1,
  }

  try {
    console.log('🔍 Searching for contact with email:', email)
    const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch(
      publicObjectSearchRequest
    )

    if (searchResponse.total > 0) {
      const existingContact = searchResponse.results[0]
      // Always update lead status to "Qualified" for notification subscriptions
      if (!existingContact.properties?.hs_lead_status || existingContact.properties?.hs_lead_status !== 'Qualified') {
        await hubspotClient.crm.contacts.basicApi.update(existingContact.id, {
          properties: {
            hs_lead_status: 'Qualified',
          },
        })
        console.log('✅ Updated contact lead status to Qualified')
      }
      console.log('✅ Found existing contact:', existingContact.id)
      return existingContact.id
    }

    // Create new contact with email
    console.log('➕ Creating new contact with email...')
    const createContactRequest = {
      properties: {
        email: email,
        hs_lead_status: 'Qualified',
      },
    }

    const createResponse = await hubspotClient.crm.contacts.basicApi.create(
      createContactRequest
    )
    console.log('✅ Created new contact:', createResponse.id)
    return createResponse.id
  } catch (e: any) {
    console.error('❌ Error in getOrCreateContactByEmail:', e?.message)
    if (e.message === 'HTTP request failed') {
      console.error('Full error response:', JSON.stringify(e.response, null, 2))
    }
    if (e.body) {
      console.error('Error body:', JSON.stringify(e.body, null, 2))
    }
    throw e
  }
}

async function fireCustomEvent(contactId: string, data: NotificationRequestData, phoneNumber: string): Promise<void> {
  // Only fire this event for PDP page notifications
  // This ensures we don't fire it for "all homes" or "upcoming home" (they have their own events)
  if (data.notification_type !== 'specific room' && data.notification_type !== 'specific home') {
    return
  }

  // Map notification_type to room_or_home boolean
  // true = room, false = home/full property
  const room_or_home = data.notification_type === 'specific room'

  // Build event properties using HubSpot internal names
  const eventProperties: Record<string, any> = {
    room_or_home: room_or_home,  // boolean: true for room, false for home
    phone_number: phoneNumber,    // formatted phone with +91
  }

  // Add optional properties
  if (data.name) eventProperties.contact_name = data.name
  if (data.property_id) eventProperties.property_id = data.property_id
  if (data.property_name) eventProperties.property_name = data.property_name
  if (data.room_id) eventProperties.rid = data.room_id  // room_id maps to 'rid' in HubSpot
  // Note: For "specific home", room_id/rid will be empty or "full_house"

  const eventPayload = {
    eventName: 'pe45469632_get_notified_property_page',  // Internal name required by HubSpot Events API
    objectId: contactId,
    occurredAt: new Date().toISOString(),  // This maps to created_at timestamp
    properties: eventProperties,
  }

  try {
    console.log('📤 Sending custom event payload:', JSON.stringify(eventPayload, null, 2))
    // Use HubSpot Events API to send custom event
    const response = await fetch('https://api.hubapi.com/events/v3/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(eventPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ HubSpot custom event failed!')
      console.error('Status:', response.status)
      console.error('Error response:', errorText)
      throw new Error(`Failed to fire HubSpot custom event: ${response.status} - ${errorText}`)
    }

    const responseData = await response.json().catch(() => ({}))
    console.log('✅ Custom event fired successfully:', eventPayload.eventName)
    console.log('Response:', JSON.stringify(responseData, null, 2))
  } catch (e: any) {
    console.error('❌ Error firing custom event:', e?.message)
    console.error('Error details:', e)
    throw e
  }
}

async function fireUpcomingHomeEvent(contactId: string, data: NotificationRequestData, phoneNumber: string): Promise<void> {
  // Build event properties using HubSpot internal names
  const eventProperties: Record<string, any> = {
    phone_number: phoneNumber,    // formatted phone with +91
  }

  // Add optional properties
  if (data.name) eventProperties.contact_name = data.name
  if (data.property_id) eventProperties.property_id = data.property_id
  if (data.property_name) eventProperties.property_name = data.property_name

  const eventPayload = {
    eventName: 'pe45469632_upcoming_home_notification',  // Internal name from HubSpot
    objectId: contactId,
    occurredAt: new Date().toISOString(),  // This maps to created_at timestamp
    properties: eventProperties,
  }

  try {
    console.log('📤 Sending upcoming home event payload:', JSON.stringify(eventPayload, null, 2))
    // Use HubSpot Events API to send custom event
    const response = await fetch('https://api.hubapi.com/events/v3/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(eventPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ HubSpot upcoming home event failed!')
      console.error('Status:', response.status)
      console.error('Error response:', errorText)
      throw new Error(`Failed to fire HubSpot upcoming home event: ${response.status} - ${errorText}`)
    }

    const responseData = await response.json().catch(() => ({}))
    console.log('✅ Upcoming home event fired successfully:', eventPayload.eventName)
    console.log('Response:', JSON.stringify(responseData, null, 2))
  } catch (e: any) {
    console.error('❌ Error firing upcoming home event:', e?.message)
    console.error('Error details:', e)
    throw e
  }
}

async function fireAllHomesEvent(contactId: string, data: NotificationRequestData, email: string): Promise<void> {
  // Build event properties using HubSpot internal names
  const eventProperties: Record<string, any> = {
    email: email,  // email address
  }

  // Note: "all homes" notifications don't have property_id or property_name
  // as they're for all future launches

  const eventPayload = {
    eventName: 'pe45469632_all_homes_notification',
    objectId: contactId,
    occurredAt: new Date().toISOString(),  // This maps to created_at timestamp
    properties: eventProperties,
  }

  try {
    console.log('📤 Sending all homes event payload:', JSON.stringify(eventPayload, null, 2))
    // Use HubSpot Events API to send custom event
    const response = await fetch('https://api.hubapi.com/events/v3/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(eventPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ HubSpot all homes event failed!')
      console.error('Status:', response.status)
      console.error('Error response:', errorText)
      throw new Error(`Failed to fire HubSpot all homes event: ${response.status} - ${errorText}`)
    }

    const responseData = await response.json().catch(() => ({}))
    console.log('✅ All homes event fired successfully:', eventPayload.eventName)
    console.log('Response:', JSON.stringify(responseData, null, 2))
  } catch (e: any) {
    console.error('❌ Error firing all homes event:', e?.message)
    console.error('Error details:', e)
    throw e
  }
}
