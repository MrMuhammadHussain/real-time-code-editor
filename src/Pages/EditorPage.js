import { useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import toast from 'react-hot-toast';


const EditorPage = () => {

  const [clients, setClients] = useState([
    { socketId: 1, username: 'M Hussain' },
    { socketId: 2, username: 'Obaid M' },
    { socketId: 3, username: 'Ammar S' },
  ])
  return (
    <div className='mainWrapper'>
      <div className='sidebar'>
        <div className='innerbar'>
          <div className='logo'>
            <img className='logoImage' src='/code-sync.png' alt='logo' />
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {
              clients.map((client) => (<Client username={client.username} key={client.socketId} />))
            }
          </div>
        </div>
        <button className='btn copyBtn' onClick={() =>
          toast.success("Room Copied!✔️")
      } >Copy Room ID</button>
        <button className='btn leaveBtn' onClick={() =>
          toast.success("Room Left ✔️")
      }>LEAVE Room</button>

      </div>
      <div className='codeEditor'>
        <Editor />
      </div>



    </div>





  )
}

export default EditorPage