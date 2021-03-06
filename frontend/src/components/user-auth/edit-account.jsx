import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CircularIndeterminate from '../utils/spinner/spinner';
import axios from '../../services/axios';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import standing from '../../assets/images/standing.png';
import { message as alert } from 'antd';
import 'antd/dist/antd.css';
import './edit-account.css';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: 'grey',
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function EditAccount() {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  //errors
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);

  useEffect(async () => {
    setLoading(true);
    const res = await axios.get('/account');
    setLoading(false);
    setFirstName(res.data.data.firstName);
    setLastName(res.data.data.lastName);
  }, []);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setFirstNameError(false);
      setLastNameError(false);

      if (firstName == '') {
        return setFirstNameError(true);
      } else if (lastName == '') {
        return setLastNameError(true);
      }

      setLoading(true);
      const editAccount = await axios.patch('/account', {
        firstName,
        lastName,
      });
      const { status, message } = editAccount.data;
      if (status === 200) {
        alert.success(message);
        history.push('/dashboard');
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="edit-account-welcome-text">
        Want to make some changes to your profile?
      </p>
      {loading && <CircularIndeterminate />}
      <div align="center">
        <img
          src={standing}
          className="edit-account-standing-photo"
          alt="profile picture"
        />
      </div>
      <Container align="center">
        <form className={classes.root} onSubmit={handleSubmit}>
          <TextField
            style={{ width: '50%', color: '#ffffff' }}
            required
            error={firstNameError}
            id="outlined-required"
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            InputProps={{
              style: { color: '#fff' },
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />
          <br />
          <TextField
            style={{ width: '50%', color: '#ffffff' }}
            required
            error={lastNameError}
            id="outlined-required"
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            InputProps={{
              style: { color: '#fff' },
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />
          <br />
        </form>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSubmit}
        >
          Update
        </Button>
      </Container>
    </>
  );
}
