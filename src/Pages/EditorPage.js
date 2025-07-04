import { useRef, useState, useEffect } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import toast from 'react-hot-toast';
import { initSoket } from '../socket';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Actions from '../Actions';

const EditorPage = () => {
  const navigate = useNavigate()
  const Location = useLocation()

  const socketRef = useRef(null)
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSoket()
      // socketRef.current.emit(Actions.JOIN,{
      //   roomId,
      //   username: Location.state?.username,
      // })
    }
    init()
  }, [])


// This Code From CHATGPT, but my code is working fine
//   useEffect(() => {
//   const init = async () => {
//     socketRef.current = initSoket(); // no await needed
//     socketRef.current.emit(Actions.JOIN, {
//       roomId: Location.state?.roomId, // Make sure this is defined!
//       username: Location.state?.username,
//     });

//     socketRef.current.on("connect", () => {
//       console.log("✅ Connected:", socketRef.current.id);
//     });

//     socketRef.current.on("disconnect", () => {
//       console.log("❌ Disconnected:", socketRef.current.id);
//     });
//   };

//   init();

//   return () => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//       console.log("👋 Socket disconnected on unmount");
//     }
//   };
// }, []);

  const [clients, setClients] = useState([
    { socketId: 1, username: 'M Hussain' },
    // { socketId: 2, username: 'Obaid M' },
    // { socketId: 3, username: 'Ammar S' },
  ])
  const leaveRoom = () => {
    navigate('/', {
      state: {
        success: true,
      }
    })

    toast.success("Left Room Successfully!👋")
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
        <button className='btn leaveBtn' onClick={leaveRoom}>LEAVE Room</button>

      </div>
      <div className='codeEditor'>
        <Editor />
      </div>



    </div>





  )
}

export default EditorPage