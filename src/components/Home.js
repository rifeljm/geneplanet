import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { getCookie, stravaSvg, oauthEndpoint, stravaApiEndpoint } from '../common/utils.js';

import css from '../css/Home.css.js';

/**
 * Check if we have Strava's cookie and if this cookie still valid
 * @return {Boolean}
 */
function isCookieValid() {
  if (getCookie('expires')) {
    const isExpiredDate = new Date(parseInt(getCookie('expires'), 10) * 1000);
    return isExpiredDate > new Date();
  }
  return false;
}

export default function Home({ activitiesToMetrics, stravaMetrics, isVisible, showDashboard }) {
  if (!isVisible) return null;

  function renderStravaStatus(stravaMetrics) {
    if (stravaMetrics.length) {
      return 'Show metrics!';
    }
    return isCookieValid() ? 'Fetch data' : 'Authorize';
  }

  /**
   * Clicking Strava button on Home screen can fire 3 different actions:
   * - if we don't have a cookie or cookie expired, authorize user by navigating to Strava's OATH
   * - if we have a valid cookie, fetch data from Strava's API
   * - if we have a metric from Strava already in our state, navigate to Dashboard tab
   */
  function onClickHandler() {
    if (stravaMetrics.length) {
      showDashboard();
    }
    if (!isCookieValid()) {
      const oauthObj = {
        client_id: STRAVA_CLIENT_ID,
        redirect_uri: STRAVA_REDIRECT_URI,
        scope: 'activity:read',
        approval_prompt: 'auto',
        response_type: 'code',
      };
      const oauthString = Object.keys(oauthObj)
        .map(key => `${key}=${oauthObj[key]}`)
        .join('&');
      document.location = `${oauthEndpoint}authorize?${oauthString}`;
    }
    if (isCookieValid()) {
      const config = {
        url: `${stravaApiEndpoint}athlete/activities`,
        headers: { Authorization: `Bearer ${getCookie('access_token')}` },
      };
      return axios(config).then(res => {
        activitiesToMetrics(res.data);
      });
    }
  }

  return (
    <React.Fragment>
      <css.StravaStatusIcon onClick={onClickHandler}>
        <css.StravaSvg dangerouslySetInnerHTML={{ __html: stravaSvg }} />
        <css.StravaStatus>{renderStravaStatus(stravaMetrics)}</css.StravaStatus>
      </css.StravaStatusIcon>
    </React.Fragment>
  );
}

Home.propTypes = {
  activitiesToMetrics: PropTypes.func.isRequired,
  stravaMetrics: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  showDashboard: PropTypes.func.isRequired,
};

