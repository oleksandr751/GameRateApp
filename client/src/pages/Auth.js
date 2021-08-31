import { Button, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainProfile from '../components/MainProfile';

import Navbar from '../components/Navbar11';
import Posts from '../components/Posts';
import Profile from '../components/Profile';
import RandomUserReviewedGames from '../components/RandomUserReviewedGames';
import ReviewedGames from '../components/ReviewedGames';
import { UsersData } from '../components/UsersData';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/auth.hook';
import { useHttp } from '../hooks/http.hook';
import { useRoutes } from '../routes';
import AuthPage from './AuthPage';
import Games from './Games';
import Home from './Home';
import OtherUserPage from './OtherUserPage';
import Products from './Products';
import Reports from './Reports';
import SelectedGame from './SelectedGame';
import UserPage from './UserPage';
import Users from './Users';

const Auth = () => {
 const alert = useAlert();
 const { token, userId, userName, eMail, login, logout } = useAuth();
 const eMail1 = eMail;
 const isAuthenticated = !!token;
 const { request } = useHttp();
 const routes = useRoutes(isAuthenticated);
 const useStyles = makeStyles((theme) => ({
  root: {
   '& .MuiTextField-root': {
    margin: theme.spacing(1),
    width: 200,
   },
  },
 }));
 const classes = useStyles();
 const [userData, setUserData] = useState(
  UsersData.map((user) => ({ ...user, id: user.id }))
 );
 const [usersData, setUsersData] = useState([]);
 const [gamesData, setGamesData] = useState([]);
 const [mainUserData, setMainUserData] = useState({});
 const [selectedUser, setSelectedUser] = useState({});
 const [selectedGame, setSelectedGame] = useState({});
 const [loading, setLoading] = useState(true);
 const [isAuth, setIsAuth] = useState(false);
 const initialState = {
  email: '',
  password: '',
 };
 const [form, setForm] = useState(initialState);
 const handleChange = (e) => {
  setForm({
   ...form,
   [e.target.name]: e.target.value,
  });
 };
 useEffect(() => {
  const fetchData = async () => {
   // You can await here
   try {
    const response = await request('/api/auth/getMainUser', 'POST', {
     eMail1,
    });
    setMainUserData(response);
    await fetch('/api/games/getGames')
     .then((response) => response.json())
     .then((data) =>
      setGamesData(data.map((game) => ({ ...game, id: game.id })))
     );
    await fetch('/api/auth/getUsers')
     .then((response) => response.json())
     .then((data) =>
      setUsersData(data.map((game) => ({ ...game, id: game.id })))
     );
    response ? setLoading(false) : setLoading(true);
   } catch (e) {
    alert.show(e.message);
   }

   // ...
  };
  fetchData();
 }, [eMail1, request, alert]);
 return (
  <>
   <AuthContext.Provider
    value={{
     token,
     login,
     logout,
     isAuthenticated,
     userId,
     userName,
     eMail,
     usersData,
     gamesData,
     mainUserData,
     selectedUser,
     selectedGame,
    }}
   >
    <div>
     {isAuthenticated ? (
      <div>
       {loading ? (
        <div>
         <img
          alt='loading....'
          src='https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'
         ></img>
        </div>
       ) : (
        <Router>
         <Navbar />
         {/* <p>{eMail}</p> */}
         <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/reports' component={Reports} />
          <Route path='/products' component={Products} />
          <Route path='/games' component={Games} />
          <Route path='/users' component={UserPage} />
          <Route path='/posts' component={Posts} />
          <Route path='/profile' component={Profile}></Route>
          <Route path='/mainProfile' component={MainProfile}></Route>
          <Route path='/reviewedGames' component={ReviewedGames}></Route>
          <Route path='/selectedGame' component={SelectedGame}></Route>
          <Route
           path='/randomUserReviewedGames'
           component={RandomUserReviewedGames}
          ></Route>
         </Switch>
        </Router>
       )}
      </div>
     ) : (
      <div className='container'>{routes}</div>
     )}
    </div>
   </AuthContext.Provider>
  </>
 );
};

export default Auth;
