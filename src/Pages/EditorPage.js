import { useRef, useState, useEffect, } from 'react'
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { initSoket } from '../socket';
import Client from '../components/Client'
import Editor from '../components/Editor'
import toast from 'react-hot-toast';
import Actions from '../Actions';

const EditorPage = () => {
  const reactorNavigat = useNavigate()
  const Location = useLocation()
  const socketRef = useRef(null)
  const { roomId } = useParams()


  const handaleError = (e) => {
    console.log("❌ Socket connection error:", e);
    toast.error("Socket connection error! Please try again later.")
    reactorNavigat('/')
  }
  const [clients, setClients] = useState([])




  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSoket()
      socketRef.current.on("connect_error", (err) => handaleError(err))
      socketRef.current.on("connect_failed", (err) => handaleError(err))
      socketRef.current.emit(Actions.JOIN, {
        roomId,
        username: Location.state?.username,
      })
      // Socket event for receiving the initial list of clients
      // Socket event for Joining a room
      socketRef.current.on(Actions.JOINED, ({ clients, username, socketId }) => {
        if (username !== Location.state?.username) {
          if (socketId !== socketRef.current.id) {
            toast.success(`${username} has joined`)
          }
        }
        setClients(clients)
      })
      // Socket event listing for disconnected
      socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} has left the room`)
        setClients((perv) => {
          return perv.filter(client => client.socketId !== socketId)

        })

      })

    }
    init()
    return () => {
      // Cleanup function to disconnect the socket and remove event listeners
      socketRef.current.disconnect()
      socketRef.current.off(Actions.JOINED)
      socketRef.current.off(Actions.DISCONNECTED)

    }
  }, [])

  if (!Location.state) {
    toast.error("Room ID Not Found! Please create a new room.")
    return <Navigate to="/" />
  }

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
          toast.success("Room ID Copied!👍")
        } >Copy Room ID</button>
        <button className='btn leaveBtn'>LEAVE Room</button>
      </div>
      <div className='codeEditor'>
        <Editor socketRef={socketRef} roomId={roomId} />
      </div>
    </div>

  )
}

export default EditorPage