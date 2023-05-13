import React from 'react'
import { MainContext } from './MainContext'

export default function MainProvider(props) {
  return (
    <MainContext.Provider value={""}>{props.children}</MainContext.Provider>
  )
}
