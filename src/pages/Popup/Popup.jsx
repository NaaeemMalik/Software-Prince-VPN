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
      if (e.token) {
        setPage('setting');
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
      ) : (
        <Setting Activate={ActivePage} />
      )}
    </div>
  );
};

export default Popup;
