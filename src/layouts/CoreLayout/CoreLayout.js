import React from 'react'
// import Header from 'components/Nav'
import './CoreLayout.scss'
import 'styles/core.scss'

// <div className='row'>
//      <Header />
//  </div>

export const CoreLayout = ({ children }) => (
  <div>
    {children}
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
