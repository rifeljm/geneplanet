import React from 'react';
import PropTypes from 'prop-types';

import css from '../css/Dashboard.css.js';

export default function Dashboard({ stravaMetrics, isVisible }) {
  if (!isVisible) return null;

  const titles = ['This year', 'Last month', 'This month', 'Avg. speed last month', 'Avg. speed this month'];

  function renderMetrics() {
    return stravaMetrics.map((metric, idx) => {
      return (
        <css.Metric key={idx}>
          <div>
            <css.MetricValue>{metric}</css.MetricValue>
            <css.MetricTitle>{titles[idx]}</css.MetricTitle>
          </div>
        </css.Metric>
      );
    });
  }

  if (!stravaMetrics.length) {
    return 'Fetch metrics from Home screen first.';
  }
  return <css.Content>{renderMetrics()}</css.Content>;
}

Dashboard.propTypes = {
  stravaMetrics: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
};
