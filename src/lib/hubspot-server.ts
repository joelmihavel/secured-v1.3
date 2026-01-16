import { Client } from '@hubspot/api-client'
import { AssociationSpecAssociationCategoryEnum } from '@hubspot/api-client/lib/codegen/crm/associations/v4'

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN })

// TODO: Replace with actual Custom Object Type ID from user
const NOTIFICATION_REQUEST_OBJECT_TYPE_ID = process.env.HUBSPOT_NOTIFICATION_OBJECT_TYPE_ID 

// TODO: Replace with actual Association Type ID from user
const CONTACT_TO_NOTIFICATION_ASSOCIATION_ID = process.env.HUBSPOT_CONTACT_TO_NOTIFICATION_ID 

export interface NotificationRequestData {
  phone?: string
  email?: string
  notification_type: 'specific room' | 'specific home' | 'all homes' | 'upcoming home'
  property_id?: string
  property_name?: string
  room_id?: string
}

export async function handleNotificationRequest(data: NotificationRequestData) {
  try {
    if (!data.phone && !data.email) {
      throw new Error('Either phone or email is required')
    }
    
    // 1. Search for Contact (prefer email if both provided)
    const contactId = await getOrCreateContact(data.email || data.phone!, data.email ? 'email' : 'phone')

    // 2. Create Notification Request Custom Object
    const notificationId = await createNotificationObject(data)

    // 3. Associate Contact with Notification Request
    await associateContactToNotification(contactId, notificationId)

    return { success: true, contactId, notificationId }
  } catch (error) {
    console.error('Error handling notification request:', error)
    throw error // Re-throw to be handled by API route
  }
}

async function getOrCreateContact(value: string, type: 'phone' | 'email'): Promise<string> {
  const publicObjectSearchRequest = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: type,
            operator: 'EQ' as any,
            value: value,
          },
        ],
      },
    ],
    sorts: ['createdate'],
    properties: ['firstname', 'lastname', 'phone', 'email'],
    limit: 1,
  }

  try {
    const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch(
      publicObjectSearchRequest
    )

    if (searchResponse.total > 0) {
      return searchResponse.results[0].id
    }

    // Create new contact
    const createContactRequest = {
      properties: {
        [type]: value,
        // firstname: '', // Optional: Add default placeholder if needed
        // lastname: '',
      },
    }

    const createResponse = await hubspotClient.crm.contacts.basicApi.create(
      createContactRequest
    )
    return createResponse.id
  } catch (e: any) {
    if (e.message === 'HTTP request failed') {
      console.error(JSON.stringify(e.response, null, 2))
    }
    throw e
  }
}

async function createNotificationObject(data: NotificationRequestData): Promise<string> {
  const properties: Record<string, string> = {
    notification_type: data.notification_type,
    status: 'active',
  }

  if (data.property_id) properties.property_id = data.property_id
  if (data.property_name) properties.property_name = data.property_name
  if (data.room_id) properties.room_id = data.room_id

  // Note: Custom objects might use different internal names for properties.
  // Assuming the user provided keys map directly to HubSpot internal names.

  const createObjectRequest = {
    properties,
    associations: [],
  }

  if(!NOTIFICATION_REQUEST_OBJECT_TYPE_ID){
    throw new Error('NOTIFICATION_REQUEST_OBJECT_TYPE_ID is not set')
  }

  try {
    const response = await hubspotClient.crm.objects.basicApi.create(
        NOTIFICATION_REQUEST_OBJECT_TYPE_ID,
        createObjectRequest
    )
    return response.id
  } catch (e) {
      console.error('Error creating notification object:', e)
      throw e
  }
}

async function associateContactToNotification(contactId: string, notificationId: string) {
    try {
        if(!NOTIFICATION_REQUEST_OBJECT_TYPE_ID){
            throw new Error('NOTIFICATION_REQUEST_OBJECT_TYPE_ID is not set')
        }
        if(!CONTACT_TO_NOTIFICATION_ASSOCIATION_ID){
            throw new Error('CONTACT_TO_NOTIFICATION_ASSOCIATION_ID is not set')
        }
        await hubspotClient.crm.associations.v4.basicApi.create(
            'contacts',
            contactId,
            NOTIFICATION_REQUEST_OBJECT_TYPE_ID,
            notificationId,
            [
                {
                    associationCategory: AssociationSpecAssociationCategoryEnum.UserDefined, 
                    associationTypeId: parseInt(CONTACT_TO_NOTIFICATION_ASSOCIATION_ID)
                }
            ]
        )
    } catch (e) {
        console.error('Error associating contact to notification:', e)
        throw e
    }
}
