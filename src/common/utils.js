import axios from 'axios';
import cookie from 'cookie';

export const oauthEndpoint = 'https://www.strava.com/oauth/';
export const stravaApiEndpoint = 'https://www.strava.com/api/v3/';

export function setCookies(data) {
  document.cookie = `strava=${[data.access_token, data.refresh_token, data.expires_at, data.athlete.id].join('|')}; expires=-999999999`;
}

export function getCookies() {
  return cookie.parse(document.cookie) || {};
}

/**
 * Returns previous month's first day
 * @return {Date} [description]
 */
export function lastMonth() {
  let d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return d;
}
/**
 * Only four possible cookies are valid to be parsed from document.cookie
 * @return {string} value of cookie
 */
export function getCookie(type) {
  const stravaTokens = getCookies().strava;
  if (!stravaTokens) {
    return null;
  }
  const keys = ['access_token', 'refresh_token', 'expires', 'athlete_id'];
  const tokenArray = stravaTokens.split('|');
  if (tokenArray.length !== 4) {
    return null;
  }
  const obj = keys.reduce((prev, key, idx) => {
    return { ...prev, [key]: tokenArray[idx] };
  }, {});
  return obj[type];
}

/**
 * If we have cookie, but this cookie will expire soon, get new access token, which will last longer
 */
export async function refreshAccessToken() {
  const secrets = {
    refresh_token: getCookie('refresh_token'),
    client_id: parseInt(STRAVA_CLIENT_ID, 10),
    client_secret: STRAVA_CLIENT_SECRET,
    grant_type: 'refresh_token',
  };
  const res = await axios.post(`${oauthEndpoint}token`, secrets);
  setCookies(res.data);
}

/**
 * Get Strava's access token to use it when requesting API's data
 */
export async function getAccessToken(code, cb) {
  const secrets = {
    code,
    client_id: parseInt(STRAVA_CLIENT_ID, 10),
    client_secret: STRAVA_CLIENT_SECRET,
    grant_type: 'authorization_code',
  };
  const res = await axios.post(`${oauthEndpoint}token`, secrets);
  const data = res.data;
  setCookies(data);
  cb(data.access_token);
}

export const stravaSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M41.03 47.852l-5.572-10.976h-8.172L41.03 64l13.736-27.124h-8.18" fill="#f9b797"/><path d="M27.898 21.944l7.564 14.928h11.124L27.898 0 9.234 36.876H20.35" fill="#f05222"/></svg>';

function monthISO(date) {
  return new Date(date).toISOString().substring(0, 7);
}

function lastMonthActivities(activities) {
  return activities.filter(x => {
    return monthISO(new Date(x.start_date)) === monthISO(lastMonth());
  });
}
function thisMonthActivities(activities) {
  return activities.filter(x => {
    return monthISO(new Date(x.start_date)) === monthISO(new Date());
  });
}

/**
 * all distances will be shown with the maximum of 1 decimal
 */
function mToKm(m) {
  return parseInt(m / 100, 10) / 10;
}

export function reduceActivitiesToMetrics(activities) {
  const thisYearDistance = activities.reduce((prev, activity) => {
    return prev + activity.distance;
  }, 0);
  const lastMonthDistance = lastMonthActivities(activities).reduce((prev, activity) => {
    return prev + activity.distance;
  }, 0);
  const thisMonthDistance = thisMonthActivities(activities).reduce((prev, activity) => {
    return prev + activity.distance;
  }, 0);
  const lastMonthTime = lastMonthActivities(activities).reduce((prev, activity) => {
    return prev + activity.elapsed_time;
  }, 0);
  const thisMonthTime = thisMonthActivities(activities).reduce((prev, activity) => {
    return prev + activity.elapsed_time;
  }, 0);

  const avgSpeedLastMonth = mToKm((lastMonthDistance / lastMonthTime) * 3600);
  const avgSpeedThisMonth = mToKm((thisMonthDistance / thisMonthTime) * 3600);

  return [
    `${mToKm(thisYearDistance)} km`,
    `${mToKm(lastMonthDistance)} km`,
    `${mToKm(thisMonthDistance)} km`,
    `${avgSpeedLastMonth} km/h`,
    `${avgSpeedThisMonth} km/h`,
  ];
}
/**
 * request Strava's activities API
 */
export function fetchStravaActivities() {
  const config = {
    url: `${stravaApiEndpoint}athlete/activities`,
    headers: { Authorization: `Bearer ${getCookie('access_token')}` },
  };
  return axios(config).then(res => {
    return res.data;
  });
}

/**
 * Check if we have Strava's cookie and if this cookie still valid
 * @return {Boolean}
 */
export function isCookieValid() {
  if (getCookie('expires')) {
    const isExpiredDate = new Date(parseInt(getCookie('expires'), 10) * 1000);
    return isExpiredDate > new Date();
  }
  return false;
}
