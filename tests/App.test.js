import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

import App from '../src/components/App.js';

const utils = require('../src/common/utils.js');

global.STRAVA_CLIENT_ID = 'STRAVA_CLIENT_ID';
global.STRAVA_CLIENT_SECRET = 'STRAVA_CLIENT_SECRET';

jest.mock('axios');

test('it renders App component', async () => {
  const { getByText } = render(<App />);
  await waitForElement(() => getByText(/Home/));
  await waitForElement(() => getByText(/Dashboard/));
  await waitForElement(() => getByText(/Authorize/));
});

test('Call getAccessToken with 1234', () => {
  const resp = {
    data: {
      access_token: 'access_token12345',
      refresh_token: 'refresh_token12345',
      expires_at: 12345,
      athlete: {
        id: 23456,
      },
    },
  };
  axios.post.mockResolvedValue(resp);
  history.replaceState({}, 'Login', '?code=1234');
  const spy = jest.spyOn(utils, 'getAccessToken');
  const RenderApp = render(<App />);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith('1234', expect.any(Function));
});

test('Show dashboard', async () => {
  const { getByText } = render(<App />);
  const DashboardButton = await waitForElement(() => getByText(/Dashboard/));
  fireEvent.click(DashboardButton);
  await waitForElement(() => getByText(/Fetch metrics from Home screen first/));
});
