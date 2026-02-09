/**
 * Global settings for the SUVIDHA Kiosk system timeouts and sessions.
 * Times are specified in milliseconds (ms) or seconds (sec) as indicated.
 */
export const KIOSK_SETTINGS = {
  // Time in milliseconds before the landing page goes into "Idle Slideshow" mode
  IDLE_TIMEOUT_MS: 3 * 60 * 1000, // 3 minutes

  // Total session duration in seconds after a user logs in
  SESSION_DURATION_SEC: 15 * 60, // 15 minutes

  // Amount of time in seconds to add when a session is extended
  EXTENSION_AMOUNT_SEC: 10 * 60, // 10 minutes

  // Grace period in seconds for the "Session Expired" dialog before auto-logout
  LOGOUT_GRACE_PERIOD_SEC: 60, // 60 seconds
};
