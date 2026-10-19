import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

export type IntakeStep = 'demographics' | 'family_background' | 'needs_assessment' | 'review_submit';

interface TelemetryPayloads {
  intake_form_start: { source: 'hero' | 'navigation' | 'pamphlet' };
  zoom_link_clicked: { schedule_slot: string; meeting_id?: string };
  resource_flyer_download: { flyer_name: string; asset_format: 'pdf' | 'png' };
  intake_step_complete: { current_step: IntakeStep; next_step: IntakeStep | 'completed'; duration_seconds: number };
}

/**
 * Global Telemetry Middleware Layer
 * Safely tracks analytics events across dual-deployment layouts.
 */
export const trackEvent = <K extends keyof TelemetryPayloads>(
  eventName: K,
  params: TelemetryPayloads[K]
): void => {
  if (!analytics) {
    // Graceful fallback if analytics is blocked by ad-blockers or running in non-supported modes
    if (import.meta.env.DEV) {
      console.log(`[Telemetry Mock Log] Event: ${eventName}`, params);
    }
    return;
  }

  try {
    logEvent(analytics, eventName, params);
  } catch (error) {
    console.error(`Telemetry transmission failed for event: ${eventName}`, error);
  }
};
