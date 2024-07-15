import { Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import LayoutMessage from './components/layout/LayoutMessage';
import Auth from './pages/Auth';
import Home from './pages/Home';

import Profil from './pages/Profil';
import { useDispatch, useSelector } from 'react-redux';
import { setUserRedux } from './redux/slices/UserSlice';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer } from 'react-toastify';
import TweetPage from './pages/TweetPage';
import axios from 'axios';
import Search from './pages/Search';
import Message from './pages/Message';
import Signet from './pages/Signet';
import Trend from './pages/Trend';

function App() {
  const dispatch = useDispatch();
  let user = useSelector((state) => state);

  let userDataHandler = () => {
    if (user.id === null) {
      const token = window.localStorage.getItem('x_user_token');
      if (token) {
        const tokenData = jwtDecode(token);
        let userId = tokenData.id;

        axios
          .post('https://localhost:8000/user/find', userId)
          .then((res) => dispatch(setUserRedux(res.data)));
      }
    }
  };

  ///A chaque changement ou rafraichissment de page, check si le state user de redux
  ///a sa data, sinon check si un token est enregistré en local storage, le décrypte
  ///et attribue la data au state user
  useEffect(() => {
    userDataHandler();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Auth />} />
        <Route
          path={'/home'}
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path={'/profil/:id'}
          element={
            <Layout>
              <Profil />
            </Layout>
          }
        />
        <Route
          path={'/messages'}
          element={
            <LayoutMessage>
              <Message />
            </LayoutMessage>
          }
        />
        <Route
          path={'/signets'}
          element={
            <Layout>
              <Signet />
            </Layout>
          }
        />
        <Route
          path={'/tweet/:id'}
          element={
            <Layout>
              <TweetPage />
            </Layout>
          }
        />
        <Route
          path={'/trend/:hashtag'}
          element={
            <Layout>
              <Trend />
            </Layout>
          }
        />
        <Route
          path={'/search/:searchValue'}
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
