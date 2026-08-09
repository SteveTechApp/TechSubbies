import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';

export type MarketplaceDiscoveryEvent = {
  eventType: 'search.performed' | 'profile.viewed' | 'invitation.sent';
  subjectUserId?: string;
  jobId?: string;
};

export type MarketplaceAnalyticsSummary = {
  windowDays: 30 | 90 | 'all';
  generatedAt: string;
  stages: {
    searches: number;
    profileViews: number;
    invitations: number;
    applications: number;
    bookings: number;
  };
  actors: {
    uniqueSearchers: number;
    uniqueProfileViewers: number;
    uniqueApplicants: number;
    uniqueBookers: number;
  };
  conversion: {
    profileViewsPerSearch: number | null;
    invitationRateFromViews: number | null;
    applicationToBookingRate: number | null;
  };
  repeatBooking: {
    bookingPairs: number;
    repeatBookingPairs: number;
    repeatBookingRate: number | null;
  };
  retention30d: {
    eligibleUsers: number;
    retainedUsers: number;
    rate: number | null;
  };
};

export async function trackMarketplaceEvent(event: MarketplaceDiscoveryEvent): Promise<boolean> {
  try {
    const response = await secureFetch(`${API_BASE_URL}/marketplace-analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return response.ok;
  } catch {
    // Analytics is non-blocking. Marketplace actions must still work if the
    // metrics endpoint is temporarily unavailable.
    return false;
  }
}

export async function getAdminMarketplaceAnalytics(
  windowDays: 30 | 90 | 'all' = 30
): Promise<MarketplaceAnalyticsSummary> {
  const response = await secureFetch(`${API_BASE_URL}/admin/marketplace-analytics?window=${windowDays}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Could not load marketplace analytics.');
  }
  return data.analytics as MarketplaceAnalyticsSummary;
}
