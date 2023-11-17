import type { Dispatch, PropsWithChildren, Reducer } from 'react';
import React, { createContext, useReducer } from 'react';
import type { MetamaskSubspaceSnap } from '@subspace/metamask-subspace-adapter/build/snap';
import { hasMetaMask } from '../services/metamask';

interface ISubspaceSnap {
  isInstalled: boolean;
  message: string;
  snap?: MetamaskSubspaceSnap;
}

export interface MetamaskState {
  subspaceSnap: ISubspaceSnap;
  hasMetaMask: boolean;
}

const initialState: MetamaskState = {
  hasMetaMask: hasMetaMask(),
  subspaceSnap: {
    isInstalled: false,
    message: ''
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MetamaskDispatch = { type: MetamaskActions; payload: any };

export const MetaMaskContext = createContext<[MetamaskState, Dispatch<MetamaskDispatch>]>([
  initialState,
  () => null
]);

export enum MetamaskActions {
  SET_INSTALLED_STATUS
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SET_INSTALLED_STATUS: {
      return {
        ...state,
        subspaceSnap: action.payload as ISubspaceSnap
      };
    }
    default: {
      return state;
    }
  }
};

export const MetaMaskContextProvider = (
  props: PropsWithChildren<Record<string, unknown>>
): React.JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MetaMaskContext.Provider value={[state, dispatch]}>{props.children}</MetaMaskContext.Provider>
  );
};
