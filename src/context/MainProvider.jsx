import React from 'react'
import { MainContext } from './MainContext'

export default function MainProvider(props) {
  return (
    <MainContext.Provider >{props.children}</MainContext.Provider>
  )
}
