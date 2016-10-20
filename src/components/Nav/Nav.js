import React from 'react'
import NavDropdown from 'components/utils/NavDropdown'
import { IndexLink, Link } from 'react-router'
import './Nav.scss'

export const Nav = () => (
  <nav className='navbar navbar-dark blue'>
    <button className='navbar-toggler hidden-sm-up' type='button' data-toggle='collapse' data-target='#collapseEx2'>
      <i className='fa fa-bars' />
    </button>

    <div className='container'>
      <div className='collapse navbar-toggleable-xs' id='collapseEx2'>
        <IndexLink to='/' className='navbar-brand'>
          Project Name
        </IndexLink>
        <ul className='nav navbar-nav'>
          <li className='nav-item' activeClassName='active'>
            <Link to='/' className='nav-link active'>Home</Link>
          </li>
          <li className='nav-item'>
            <Link to='/counter' activeClassName='active' className='nav-link'>Counter</Link>
          </li>
          <li className='nav-item btn-group'>
            <NavDropdown title={<span>Test 124</span>}>
              <a className='dropdown-item'>Action</a>
              <a className='dropdown-item'>Another action</a>
              <a className='dropdown-item'>Something else here</a>
            </NavDropdown>
          </li>
        </ul>

        <form className='form-inline'>
          <input className='form-control' type='text' placeholder='Search' />
        </form>
      </div>

    </div>

  </nav>
)

export default Nav
