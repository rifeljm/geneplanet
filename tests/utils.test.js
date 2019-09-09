import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getCookies,
  setCookies,
  lastMonth,
  getCookie,
  oauthEndpoint,
  getAccessToken,
  refreshAccessToken,
  reduceActivitiesToMetrics,
} from '../src/common/utils.js';
import { stravaToken, activities } from './fixtures.js';

global.STRAVA_CLIENT_ID = 'STRAVA_CLIENT_ID';
global.STRAVA_CLIENT_SECRET = 'STRAVA_CLIENT_SECRET';

test('getCookies()', () => {
  expect(Object.keys(getCookies()).length).toBe(0);
  expect(typeof getCookies()).toBe('object');
  document.cookie = 'something=123;expires=-999999999';
  expect(getCookies().something).toBe('123');
  /* delete cookie */
  document.cookie = 'something=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
});

test('setCookies()', () => {
  setCookies(stravaToken);
  expect(document.cookie).toBe('strava=abc|efg|123|456');
  document.cookie = 'strava=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
});

test('lastMonth()', () => {
  const DATE_TO_USE = new Date('2019-09-09');
  const _Date = Date;
  global.Date = jest.fn(() => DATE_TO_USE);
  expect(lastMonth().getMonth()).toBe(7);
  global.Date = _Date;
});

test('getCookie()', () => {
  document.cookie = 'strava=access_token_string|2|3|4;expires=-999999999';
  expect(getCookie('access_token')).toBe('access_token_string');
  document.cookie = 'strava=; expires=Thu, 01 Jan 1970 00:00:01 GMT';

  expect(getCookie('')).toBe(null);
});

test('getAccessToken()', () => {
  const mockAdapter = new MockAdapter(axios);
  mockAdapter.onPost(`${oauthEndpoint}token`).reply(200, {
    access_token: 'access_token12345',
    refresh_token: 'refresh_token12345',
    expires_at: 12345,
    athlete: {
      id: 23456,
    },
  });
  getAccessToken('code12345', accessToken => {
    expect(accessToken).toBe('access_token12345');
    expect(document.cookie).toBe('strava=access_token12345|refresh_token12345|12345|23456');
  });
});

test('getRefreshToken()', () => {
  const mockAdapter = new MockAdapter(axios);
  mockAdapter.onPost(`${oauthEndpoint}token`).reply(200, {
    access_token: 'access_token12345',
    refresh_token: 'refresh_token12345',
    expires_at: 12345,
    athlete: {
      id: 23456,
    },
  });
  refreshAccessToken('code12345');
  expect(document.cookie).toBe('strava=access_token12345|refresh_token12345|12345|23456');
});

test('reduceActivitiesToMetrics()', () => {
  let result = reduceActivitiesToMetrics(activities);
  expect(result.toString()).toBe(['100.6 km', '19.1 km', '21.5 km', '11 km/h', '9.2 km/h'].toString());
});
