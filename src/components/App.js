import React from 'react';
import { navigate } from '@reach/router';
import QS from 'query-string';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { refreshAccessToken, getAccessToken, reduceActivitiesToMetrics, fetchStravaActivities, isCookieValid } from '../common/utils.js';
import Home from './Home.js';
import Dashboard from './Dashboard.js';

import css from '../css/App.css.js';

function App() {
  const [stravaMetrics, setStravaMetrics] = React.useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  React.useEffect(() => {
    if (document.location.search) {
      /* OAUTH will redirect us to our website with ?code querystring, which we need to get access token */
      const qs = QS.parse(window.location.search);
      if (qs.code) {
        getAccessToken(qs.code, () => {
          navigate('/');
        });
      }
    }
    /* refresh access_token every 3 hours, TODO: check expiration date of cookie first and fix this setInterval! */
    setInterval(() => {
      refreshAccessToken();
    }, 3 * 3600 * 1000);

    /* refresh metrics every hour */
    setInterval(() => {
      if (isCookieValid()) {
        fetchMetrics();
      } else {
        /* TODO: "you have been logged out" message */
        setStravaMetrics([]);
      }
    }, 3600 * 1000);
  }, []);

  function handleTabChange(e, tabIndex) {
    setTabIndex(tabIndex);
  }

  async function fetchMetrics() {
    const activities = await fetchStravaActivities();
    const metrics = reduceActivitiesToMetrics(activities);
    setStravaMetrics(metrics);
  }

  function showDashboard() {
    setTabIndex(1);
  }

  return (
    <React.Fragment>
      <css.GlobalStyle />
      <AppBar position="static">
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Home" />
          <Tab label="Dashboard" />
        </Tabs>
      </AppBar>
      <css.Content>
        <Home isVisible={tabIndex === 0} stravaMetrics={stravaMetrics} showDashboard={showDashboard} fetchMetrics={fetchMetrics} />
        <Dashboard isVisible={tabIndex === 1} stravaMetrics={stravaMetrics} />
      </css.Content>
    </React.Fragment>
  );
}

export default App;
