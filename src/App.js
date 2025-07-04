import './App.css';
import { BrowserRouter, Routes ,Route } from 'react-router-dom';
import Home from './Pages/Home';
import EditorPage from './Pages/EditorPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
   <>
   <div>
    <Toaster position='top-center'  
    toastOptions={{
      success:{
        theme: {
          primary: "#4aed88",
        },
        duration: 1500,
      },
    error:{
      duration: 1500,
    }
    }}
    />

   </div>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Home />}></Route>
    <Route path='/editor/:roomId' element={<EditorPage />}></Route>
   </Routes>
   </BrowserRouter>
   </>
  );
}

export default App;
