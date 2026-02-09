'use server';

/**
 * Server action to fetch location data via IP to bypass CORS restrictions.
 */
export async function getIpLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }

    const data = await response.json();
    
    // Return the detected data. In prototype mode, we return the detected city/region
    // even if the IP is outside India (e.g., Cloud Workstation IP) to show active detection.
    return {
      district: data.city || 'New Delhi',
      state: data.region || 'Delhi',
      success: true
    };
  } catch (error) {
    console.error('Location fetch error:', error);
    return { success: false, reason: 'Fetch failed' };
  }
}
