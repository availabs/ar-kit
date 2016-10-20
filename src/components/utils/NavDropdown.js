import React from 'react'

class NavDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false }
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    this.setState({ open: !this.state.open })
  }
  render () {
    return (
      <div>
        <a className='nav-link dropdown-toggle' aria-expanded={this.state.open} onClick={this.toggle}>
          {this.props.title}
        </a>
        <div className='dropdown-menu' style={{ display: this.state.open ? 'block' : 'none' }}>
          {this.props.children}
        </div>
      </div>
    )
  }

}

NavDropdown.propTypes = {
  children : React.PropTypes.array.isRequired,
  title : React.PropTypes.element.isRequired
}

export default NavDropdown
