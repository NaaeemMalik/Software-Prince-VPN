import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import '../Popup.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = ({ Activate }) => {
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState('error');
  const [message, setMessage] = React.useState('This is an Error Message');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  var Server = chrome.runtime;
  var Store = chrome.storage.local;

  const handleClick = () => {
    if (email === '' || password === '') {
      showAlert('error', 'Please fill all the fields');
      return;
    }
    console.log('email: ' + email);
    Server.sendMessage(
      { type: 'login', email: email, password: password },
      (res) => {
        if (res?.token) {
          Store.set({ token: res.token });
          Activate('setting');
        } else {
          showAlert('error', 'Incorrect Email/Password');
        }
      }
    );
  };

  const showAlert = (type, message) => {
    setAlert(type);
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <div className="App">
      <Box>
        <Typography
          variant="h3"
          component="div"
          gutterBottom
          sx={{ fontWeight: 'bold', textAlign: 'left', marginTop: '1rem' }}
        >
          LOGIN
        </Typography>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          sx={{ marginTop: '1rem', width: '100%' }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          type="password"
          variant="outlined"
          sx={{ marginTop: '1rem', width: '100%' }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          variant="contained"
          sx={{
            fontWeight: 'bold',
            width: '100%',
            marginTop: '1rem',
            height: '2.5rem',
          }}
          onClick={handleClick}
        >
          LOGIN
        </Button>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alert} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
