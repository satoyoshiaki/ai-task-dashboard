"use client";

import { useSyncExternalStore } from "react";

type Setter<T> = (updater: Partial<T> | ((state: T) => T)) => void;

export interface SimpleStore<T> {
  getState: () => T;
  setState: Setter<T>;
  subscribe: (listener: () => void) => () => void;
  hydrate: () => void;
  useStore: <U>(selector: (state: T) => U) => U;
}

export const createStore = <T>(initialState: T, persistKey?: string): SimpleStore<T> => {
  let state = initialState;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((listener) => listener());

  const hydrate = () => {
    if (hydrated || !persistKey || typeof window === "undefined") {
      hydrated = true;
      return;
    }

    const raw = window.localStorage.getItem(persistKey);
    if (raw) {
      state = { ...state, ...JSON.parse(raw) };
    }
    hydrated = true;
  };

  const setState: Setter<T> = (updater) => {
    state =
      typeof updater === "function" ? (updater as (current: T) => T)(state) : { ...state, ...updater };
    if (persistKey && typeof window !== "undefined") {
      window.localStorage.setItem(persistKey, JSON.stringify(state));
    }
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getState = () => state;

  const useStore = <U,>(selector: (current: T) => U) =>
    useSyncExternalStore(subscribe, () => selector(getState()), () => selector(initialState));

  return { getState, setState, subscribe, hydrate, useStore };
};
