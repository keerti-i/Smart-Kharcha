import { useState, useEffect } from 'react';
import { createContainer } from 'react-tracked';
import { loadState, saveState } from './Helpers';

const globalState = {
  // initial global values
  layoutMode: 'static',
  layoutColorMode: 'dark',
  currencies: [],
  currentCurrency: null,
  user: null,
};

const useLocalState = () => {
  const [state, setState] = useState(loadState() || globalState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return [state, setState];
};

// Rename Provider to StoreProvider for clarity
const { Provider: StoreProvider, useTracked } = createContainer(useLocalState);

export { StoreProvider, useTracked };
