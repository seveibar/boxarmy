import React from 'react'
import { connect } from 'react-redux'
import { PageTemplate } from 'components'
import {
  selectPlay,
  selectMode,
  goToMain
} from 'store/menu/actions'

const MenuPage = (props: any) => {
  const { state, dispatch } = props
  const { submenu, mode } = state

  let main
  switch (submenu) {
    case 'intro':
      main = (
        <div>
          <div> { 'intro' } </div>
          <button
            onClick={
              () => dispatch(selectPlay())
            }>
            play
          </button>
        </div>
      )
      break
    case 'select-mode':
      main = (
        <div>
          <div> { 'selecting mode' } </div>
          <button
            onClick={
              () => dispatch(selectMode('1v1'))
            }>
            { '1v1' }
          </button>
          <button
            onClick={
              () => dispatch(selectMode('FFA8'))
            }>
            { 'FFA8' }
          </button>
        </div>
      )
      break
    case 'waiting':
      main = (
        <div>
          <div> { 'waiting in lobby' } </div>
        </div>
      )
      break
    default:
      main = (<div> { 'nothing' } </div>)
      break
  }

  return (
    <PageTemplate>
      { main }
    </PageTemplate>
  )
}

export default connect(
  (state) => ({ state: state.menu }),
  (dispatch) => ({ dispatch })
)(MenuPage)
