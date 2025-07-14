import { useRef, useState, useEffect, } from 'react'
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { initSoket } from '../socket';
import Client from '../components/Client'
import Editor from '../components/Editor'
import toast from 'react-hot-toast';
import Actions from '../Actions';

const EditorPage = () => {
  const reactNavigator = useNavigate()
  const Location = useLocation()
  const socketRef = useRef(null)
  const codeRef = useRef(null)
  const { roomId } = useParams()

  const handaleError = (e) => {
    // console.log("❌ Socket connection error:", e);
    toast.error("Socket connection error! Please try again later.")
    reactNavigator('/')
  }
  const [clients, setClients] = useState([])
  const [typingUser, setTypingUser] = useState(null)

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

      socketRef.current.on(Actions.TYPING, ({ username }) => {
        if (username !== Location.state?.username) {
          setTypingUser(username)
          setTimeout(() => {
            setTypingUser(null)
          }, 2000)
        }
      })

      socketRef.current.on(Actions.CODE_OUTPUT,({output})=>{
        document.querySelector(".outputArea").textContent = output

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
      socketRef.current.off(Actions.TYPING)
      socketRef.current.off(Actions.CODE_OUTPUT)

    }
  }, [])//[Location.state?.username, roomId]

  const copyRoomId = () => {
    try {
      navigator.clipboard.writeText(roomId)
      toast.success("Room ID Copied!👍")
    } catch (error) {
      toast.error("Failed to Copy Room ID!'😮‍💨")
    }
  }
  const leaveRoom = () => {
    reactNavigator('/')
  }

  if (!Location.state) {
    toast.error("Room ID Not Found! Please create a new room.")
    return <Navigate to="/" />
  }
  const runCode = () => {
    try {
      if (codeRef.current) {
        document.querySelector(".outputArea").textContent = "";

        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.join(" "));
        };
        const result = eval(codeRef.current)

        let codeOutput = ""

        if (logs.length > 0) {
          codeOutput = logs.join("\n");
        } else if (result !== undefined) {
          codeOutput = result.toString()
        } else {
          codeOutput = "Code executed successfully!"
        }
        document.querySelector(".outputArea").textContent = codeOutput

        socketRef.current.emit(Actions.CODE_OUTPUT, {
          roomId,
          output: codeOutput,
        })
        toast.success("Code Executed Successfully! 🎉");

      }
    } catch (error) {
      document.querySelector(".outputArea").textContent = error.message;

      socketRef.current.emit(Actions.CODE_OUTPUT,{
        roomId,
        output : error.message
      })

      toast.error("Error in Code Execution! Please check your code.😢")

    }
  }

  return (
    <div className='mainWrapper'>
      <div className='sidebar'>
        <div className='innerbar'>
          <div className='logo'>
            <img className='logoImage' src='/code-sync.png' alt='logo' />
          </div>
          <h5>{clients.length} User{clients.length !== 1 ? 's' : ''} Connected</h5>
          {typingUser && (<span className='typingBox'>{typingUser} is typing</span>)}


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
        <Editor socketRef={socketRef} roomId={roomId} username={Location.state?.username} runCode={runCode} onCodeSync={(code) => { codeRef.current = code }} />
        <div className='codeOutput'>
          <button className='btn runBtn' onClick={runCode}>🚀 Run Code </button>
          <h6>Output</h6>
          <pre className='outputArea'></pre>

        </div>
      </div>
    </div>

  )
}

export default EditorPage