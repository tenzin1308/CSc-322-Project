import logo from './logo.svg';

import {BrowserRouter, Route, Link} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import './App.css';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { useSelector } from 'react-redux';
import RegisterScreen from './screens/RegisterScreen';


function App() {

  const userSignin = useSelector(state => state.userSignin);
  const {userInfo} = userSignin;

  const openMenu = () =>{
    document.querySelector(".sidebar").classList.add("open");
  }

  const closeMenu = () =>{
    document.querySelector(".sidebar").classList.remove("open");
  }

  return (
    <BrowserRouter>
      <div className="grid-container">
              <header className="header">

                  <div className="brand">
                      <button onClick={openMenu}>
                          &#9776;
                      </button>
                      <Link to="/">Future Tech</Link> 
                  </div>
                  <div className="header-links">
                      <a href="cart.html">Cart</a>
                      {
                        userInfo ? <Link to="/profile">{userInfo.name}</Link> :
                        <Link to="/signin">Sign In</Link>

                      }
                  </div>
              </header>

              <aside className="sidebar">
                  <h3>Shopping Categories</h3>
                  <button className="sidebar-close-button" onClick={closeMenu}>x</button>
                  <ul>
                      <li>
                          <a href="computers.html">Computer</a>
                      </li>
                      <li>
                          <a href="parts.html">Computer Parts</a>
                      </li>
                  </ul>
              </aside>
              
              <main className="main">
                  <div className="content">
                    <Route path="/signin" component={SigninScreen} />
                    <Route path="/register" component={RegisterScreen} />
                    <Route path="/product/:id" component={ProductScreen} />
                    <Route path="/cart/:id?" component={CartScreen} />
                    <Route path="/" exact={true} component={HomeScreen} />
                    
                  </div>
                  
              </main>
              <footer className="footer">
                  All right reserved.
              </footer>
          </div>
        </BrowserRouter>
  );
}

export default App;
