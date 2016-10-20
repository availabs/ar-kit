import React from 'react'
// import DuckImage from '../assets/Duck.jpg'
// import './Login.scss'

export const Login = () => (
  <div className='container'>
    <div className='row'>
      <div className='col-sm-6 col-md-4 offset-md-4'>
        <div className='card'>
          <div className='view overlay hm-white-slight'>
            <br />
            <img style={{ width: '96px',
              height: '96px',
              margin: '0 auto 10px',
              display: 'block',
              borderRadius: '50%' }}
              src='https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120'
              alt='' />
            <a href='#'>
              <div className='mask' />
            </a>
          </div>
          <div className='card-block'>
            <h4 className='card-title' style={{ textAlign: 'center' }}>Sign In</h4>
            <p className='card-text'>
              <form className='form-signin'>
                <input type='text' className='form-control' placeholder='Login' required autoFocus />
                <input type='password' className='form-control' placeholder='Password' required />
                <button className='btn btn-lg btn-primary btn-block' type='submit'>
                    Sign
                </button>
              </form>
            </p>
          </div>
        </div>
        <a href='#' className='text-right new-account'>Forgot Password?</a>
      </div>
    </div>
  </div>
)

export default Login
