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
      main = (<div> { 'selecting mode' } </div>)
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
