import React, { useState, useContext } from "react";
import { AuthContext } from "./index";
import * as firebase from 'firebase'
import { withRouter } from 'react-router-dom'

const Login = ({history}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrors] = useState("");

  const Auth = useContext(AuthContext);

  const handleForm = e => {
    e.preventDefault();
    firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .then(
      res =>{
        if(res.user) Auth.setLoggedIn(true);
        console.log(res);
        history.push('/reports')
      })
      .catch(e => {
        setErrors(e.message);
        console.log(e);
      })
    
    //Auth.setLoggedIn(true);
  };
  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => { 
      firebase
      .auth()
      .signInWithRedirect(provider)
      //.signInWithPopup(provider)
      .then(result => {
        console.log(result);
        history.push('/reports')
        Auth.setLoggedIn(true);
      })
      .catch(e => setErrors(e.message));
    })
    
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={e => handleForm(e)}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          name="email"
          type="email"
          placeholder="email"
        />
        <input
          onChange={e => setPassword(e.target.value)}
          name="password"
          value={password}
          type="password"
          placeholder="password"
        />
        <hr />
        <button 
          class="googleBtn" 
          type="button"
          onClick={() => handleGoogleLogin()}
          >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="logo"
          />
          Login With Google
          </button>
        <button type="submit">Login</button>
        <span>{error}</span>
      </form>
    </div>
  );
};

export default withRouter(Login);