import React from 'react'

const Home = () => {
  return (
    <div className='homePageWarpper'>
      <div className='formWrapper'>
        <img className='homeLogo' src='./code-sync.png' alt='code-sync-logo' />
        <h4 className='mainLable'>Let's Code Together Real-Time</h4>
        <div className='inputGroup'>
          <input type='text' className='inputBox' placeholder='Enter Room ID' />
          <input type='text' className='inputBox' placeholder='Enter USERNAME' />
          <button className='btn joinBtn'>Join</button>
          <span className='createInfo'>don't have a room invitation? &nbsp;
            <a href='' className='createNewBtn'>New Room</a>
          </span>


        </div>

      </div>
      <footer>
        <h4>Created by <a target='_' href="https://github.com/MrMuhammadHussain">Mr.Muhammad-Hussain</a>✌️
        </h4>

      </footer>
    </div>
  )
}

export default Home