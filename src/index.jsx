import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';
import NuclearPoE from './build/contracts/NuclearPoE.json';

const drizzleOptions = {
  contracts: [NuclearPoE],
  polls: {
    blocks: 3000,
    accounts: 2000,
  },
};

const drizzle = new Drizzle(drizzleOptions);

ReactDOM.render(
  <DrizzleContext.Provider drizzle={drizzle}>
    <App />
  </DrizzleContext.Provider>,
  document.getElementById('root')
);
