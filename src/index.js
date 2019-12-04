import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import routes from "./routes.js";
import Header from "./Header";
import "./styles.css";

import protectedRoutes from './protectedRoutes.js';
import ProtectedRouteHoc from './ProtectedRouteHOC';
import  firebaseConfig  from "./firebase.config.js"
import * as firebase from 'firebase';

import * as serviceWorker from './serviceWorker';

// initialize firebase & db object
firebase.initializeApp(firebaseConfig)
//const baseDb = myFirebase.firestore();
//export const db = baseDb;

//

export const AuthContext = React.createContext(null);

function App() {
    const [isLoggedIn, setLoggedIn] = useState(false)

    function readSession() {
        const user = window.sessionStorage.getItem(
                `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
            );
            if (user) setLoggedIn(true)
      }
      useEffect(() => {
        readSession()
      }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
            Is logged in? {JSON.stringify(isLoggedIn)}
            <div className = "App">
                <Router>
                    <Header />
                    <Switch>
                        {protectedRoutes.map(route =>(
                            <ProtectedRouteHoc
                                key={route.path}
                                isLoggedIn={isLoggedIn}
                                path={route.path}
                                component={route.main}
                                exact={route.exact}
                                public={route.public}
                            />
                        ))}
                        {routes.map(route => (
                            <Route 
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                component={route.main}
                            />
                        ))}
                    </Switch>
                </Router>
            </div>
        </AuthContext.Provider>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);







// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
