'use client';
import React from 'react'
import { Provider } from 'react-redux'
import {store} from "@/redux/store"

interface ProviderProps {
  children: React.ReactNode;
}

const ReduxProvider = (props: ProviderProps) => {
  return (
    <Provider store={store}>{props.children}</Provider>
  )
}

export default ReduxProvider

