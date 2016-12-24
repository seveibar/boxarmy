// @flow

import React from 'react'

import { PageTemplate } from 'components'

const HomePage = (props) => {
  console.log(props);
  return (
    <PageTemplate>
      {JSON.stringify(props)}
    </PageTemplate>
  )
}

export default HomePage
