import { useState } from 'react'
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')

  const createNewRoom = (e) => {
    e.preventDefault()
    const id = uuid()
    setRoomId(id)
    toast.success("New Room Created Successfully!🎉")

  };
  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ID or Name is Missing!😮‍💨")
      return
    }
    navigate(`/editor/${roomId}`,
      {
        state: {
          username,
        }
      }
    )
  };
  const handleEnterKey = (e) => {
    if (e.code === 'Enter') {
      joinRoom()
    }
  }

  return (
    <div className='homePageWarpper'>

      <div className='formWrapper'>
        <img className='homeLogo' src='./code-sync.png' alt='code-sync-logo' />
        <h4 className='mainLable'>Code Together & Real-Time</h4>

        <div className='inputGroup'>
          <input type='text' required className='inputBox'
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleEnterKey}
            placeholder='Room ID Here' />

          <input type='text' required className='inputBox' maxLength={10}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleEnterKey}
            placeholder='Enter USERNAME Here' />

          <button className='btn joinBtn'
            onClick={joinRoom} >Join🤝</button>

          <span className='createInfo'>
            Don't have a room invitation🤔&nbsp;Create&nbsp;
            <a onClick={createNewRoom}
              href='' className='createNewBtn'>New Room!</a>😎
          </span>
        </div>
      </div>
      <footer>
        <h4>Created by <a target='_'
          href="https://github.com/MrMuhammadHussain">Mr.Muhammad-Hussain</a>✌️
        </h4>
      </footer>
    </div>
  )
}
export default Home