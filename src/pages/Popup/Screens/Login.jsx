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
    Server.sendMessage({ type: 'login', email, password }, (res) => {
      if (res?.userid) {
        Store.set({ userid: res.userid });
        Activate('main');
      } else {
        showAlert('error', 'Incorrect Email/Password');
      }
    });
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
    <div className="App bglogin">
      <Box display="flex" justifyContent="center" alignItems="center">
        <img src="logo_new (2).png" className="logo_new" alt="logo" />
      </Box>
      <Box>
        <Typography
          component="div"
          gutterBottom
          sx={{ textAlign: 'center', marginTop: '1rem' }}
        >
          Proceed with your <b className="fontRed">Login</b>
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
            width: '85%',
            marginTop: '1rem',
            height: '2.5rem',
            backgroundColor: 'red',
          }}
          onClick={handleClick}
        >
          LOGIN
        </Button>
        <Typography
          component="div"
          gutterBottom
          sx={{ textAlign: 'center', marginTop: '1rem' }}
        >
          <br />
          <label>Don't have an account</label>
          <br />
          <a
            className="fontRed"
            target="_blank"
            href="https://www.smartersvpn.com/#pricing"
          >
            Get a Free Trail
          </a>
        </Typography>
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
