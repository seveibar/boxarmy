import React from 'react'
import { Route, IndexRoute } from 'react-router'

import { App } from 'components'
import { MenuPage, GamePage } from 'containers'

const routes = [
  (<Route path="/game" component={App}>
    <IndexRoute component={MenuPage} />
  </Route>),
  (<Route path="/" component={App}>
    <IndexRoute component={GamePage} />
  </Route>)
]

export default routes
