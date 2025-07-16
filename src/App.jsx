import {useEffect, useState} from "react";
import LoginPage from "./components/LoginPage.jsx";
import MainPage from "./components/MainPage.jsx";


// core UI Component of the console.
const App = () => {
    // load a jwt token from local storage
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem("shop_jwt");
        return savedToken ? savedToken : "";
    });
    // record token to localstorage, whenever it changes
    useEffect(() => {
        localStorage.setItem("shop_jwt", token);
    }, [token])
    // if token not authorised, prompt to login
    if (!token) {
        return (
            <LoginPage setToken={setToken} />
        )
    } else  { // show console
        return (
            <MainPage token={token}/>
        )
    }
}

export default App;