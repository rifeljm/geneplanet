import React from 'react';
import PropTypes from 'prop-types';

import { getCookie, isCookieValid, stravaSvg, oauthEndpoint, stravaApiEndpoint } from '../common/utils.js';

import css from '../css/Home.css.js';

export default function Home({ stravaMetrics, isVisible, showDashboard, fetchMetrics }) {
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
      fetchMetrics();
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
  fetchMetrics: PropTypes.func.isRequired,
  stravaMetrics: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  showDashboard: PropTypes.func.isRequired,
};

