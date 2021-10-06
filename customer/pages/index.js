import React from 'react'
import {connect} from 'react-redux'
import Head from 'next/head'
import Home from './Home';

class Index extends React.Component {
  render () {

    return (
      <div>
        <Head>
          <meta name="title" content="Paperbird" />
          <meta name="description" content='Find the best paper products online.'  />
        </Head>
        <Home/>

      </div>
    )
  }
}


export default Index
