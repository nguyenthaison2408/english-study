
import './App.scss';
import Header from './components/Header/Header.jsx';

import { Link  } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import Footer from './components/Footer/Footer';
const App = () => {

  return (
    
    <div className="app">
      <div className='header-container'><Header/>
      </div>

      <div className='main-container'>
         <div className='sidenav-container'></div>
         <div className='app-content'>
        

          <Outlet></Outlet>
             <div className='footer-container'><Footer/>
      </div>
         </div>
        
      </div>
    
    
    </div>
  
  );
}

export default App;
