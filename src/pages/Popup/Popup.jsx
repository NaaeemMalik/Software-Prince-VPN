import React, { useLayoutEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import Login from './Screens/Login';
import Main from './Screens/Main';
import Setting from './Screens/Setting';

const Popup = () => {
  const [page, setPage] = React.useState('login');

  var Store = chrome.storage.local;

  useLayoutEffect(() => {
    Store.get((e) => {
      if (e.userid) {
        setPage('main');
      }
      if (e.activate === undefined) {
        Store.set({ activate: true });
      }
    });
  }, []);

  const ActivePage = (state) => {
    console.log(state);
    if (state) {
      setPage(state);
    }
  };

  return (
    <div className="App">
      {page === 'login' ? (
        <Login Activate={ActivePage} />
      ) : page === 'main' ? (
        <Main Activate={ActivePage} />
      ) : page === 'setting' ? (
        <Setting Activate={ActivePage} />
      ) : null}
    </div>
  );
};

export default Popup;
