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
  const codeRef = useRef(null)
  const { roomId } = useParams()


  const handaleError = (e) => {
    // console.log("❌ Socket connection error:", e);
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
          if (socketId !== socketRef.current.id) {
            toast.success(`${username} has Joined ☺️ `)
        }
        setClients(clients)
        socketRef.current.emit(Actions.SYNC_CODE, {
          code: codeRef.current,
           socketId,
        })
      })
      // Socket event listing for disconnected
      socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} has Left the Room 😇`)
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

  const copyRoomId = () => {
    try {
      navigator.clipboard.writeText(roomId)
      toast.success("Room ID Copied!👍")
    } catch (error) {
      toast.error("Failed to Copy Room ID!'😮‍💨")
    }
  }
  const leaveRoom = () => {
    reactorNavigat('/')

  }

  if (!Location.state) {
    toast.error("Room ID Not Found! Please create a new room.")
    return <Navigate to="/" />
  }
  const runCode = () => {
    try {
      if (codeRef.current){
      const result = eval(codeRef.current)
      document.querySelector(".outputArea").textContent = result;
      toast.success("Code Executed Successfully! 🎉")
      }
    } catch (error) {
      document.querySelector(".outputArea").textContent = error.message;
      toast.error("Error in Code Execution! Please check your code.😢")
      console.error("Error executing code:", error);

      
    }
  }

  return (
    <div className='mainWrapper'>
      <div className='sidebar'>
        <div className='innerbar'>
          <div className='logo'>
            <img className='logoImage' src='/code-sync.png' alt='logo' />
          </div>
          <h4>{clients.length} User{clients.length !== 1 ? 's' : ''} Connected</h4>
          <div className='clientsList'>
            {
              clients.map((client) => (<Client username={client.username} key={client.socketId} />))
            }
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId} >Copy Room ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>LEAVE Room</button>
      </div>
      <div className='codeEditor'>
        <Editor socketRef={socketRef} roomId={roomId} onCodeSync={(code) => {
          codeRef.current = code
        }} />
        <button className='btn runBtn' onClick={runCode}>▶️ Run Code </button>
        <div className='codeOutput'>
          <h3>Output </h3>
          <pre className='outputArea'></pre>

        </div>
      </div>
    </div>

  )
}

export default EditorPage