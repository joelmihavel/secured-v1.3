export interface HubSpotFormResponse {
  success: boolean;
  message?: string;
}

export const submitHubSpotForm = async (
  portalId: string,
  formId: string,
  fields: Record<string, string>,
  context?: { pageUri?: string; pageName?: string }
): Promise<HubSpotFormResponse> => {
  const url = `https://forms.hubspot.com/uploads/form/v2/${portalId}/${formId}`;

  const formData = new URLSearchParams();

  // Append all fields
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Get the HubSpot tracking cookie (hutk)
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Get user's IP address
  const getIpAddress = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Failed to fetch IP address:', error);
      return null;
    }
  };

  // Build hs_context with IP address and hutk cookie
  const hutk = getCookie('hubspotutk');
  const ipAddress = await getIpAddress();

  const hsContext: Record<string, any> = {
    ...context,
  };

  if (hutk) {
    hsContext.hutk = hutk;
  }

  if (ipAddress) {
    hsContext.ipAddress = ipAddress;
  }

  // Add page URI if not provided
  if (typeof window !== 'undefined' && !hsContext.pageUri) {
    hsContext.pageUri = window.location.href;
    hsContext.pageName = document.title;
  }

  // Append hs_context with all tracking data
  formData.append('hs_context', JSON.stringify(hsContext));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HubSpot form submission failed:', response.status, errorText);
      throw new Error(`HubSpot form submission failed: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting HubSpot form:', error);
    throw error;
  }
};


export const submitInterestLeads = async ({
  phone,
  Property_Interest  = 'all_properties' 
}: {
  phone: string
  Property_Interest?: string
}) => {
  const portalId = '45469632'
  const formId = 'd727a91a-0091-485c-b0a4-77d0b8d9fcb2'
  return await submitHubSpotForm(portalId, formId, {
    phone,
    Property_Interest
  }) 
}