import react from "react";
import  SvgIcon, { Alert, Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import Admin from "../../Models/Admin";
import { LoginModel } from "../../Models/loginModel";
import User from "../../Models/User";
import "./Login.css";
import { useState } from "react";
import { useEffect } from "react";
import { store } from "../redux/store";
import { AuthActionType, UserRole } from "../redux/authState";

function Login(): JSX.Element {
    const [users, setUsers] = useState<User[]>([]);
    const [admin, setAdmin] = useState<Admin[]>([]);
    const {register, handleSubmit} = useForm<LoginModel>();
    const navigate = useNavigate();
    const [alert, setAlert] = useState<Boolean>(false);
    var hash = require('object-hash');

    const alertOn = ()=>{
        if (alert === true){
            return <Alert variant="outlined" severity="error">One of the details you entered is incorrect</Alert>
        }
    };
    
    const usersMap = (user_name:string,password:string) => {
        let response = false;
        users.map((user: { user_name: string; password: string; }) => {if (hash(user_name)===user.user_name && hash(password)===user.password){response = true}
        else{
            setAlert(true)
        }});
        return response
    };
        

    useEffect(()=>{
        axios.get("http://localhost:3003/admin/all")
        .then(response => response.data.length ===0?navigate("/modal"): setAdmin(response.data))
        axios.get("http://localhost:3003/user/all")
        .then(response => setUsers(response.data))
    },[]);

const send =  async (userLogin: LoginModel) => {
        try {
                if(userLogin.typeUser === "admin" && hash(userLogin.user_name) === admin[0].admin_name && hash(userLogin.password) === admin[0].admin_code){
                    //add new admin
                    const response = await axios.post("http://localhost:3003/admin/login", userLogin);
                    const token = response.data;
                    store.dispatch({type:AuthActionType.Login, payload:token});
                    navigate("/admin")
                }
                if (userLogin.typeUser === "user" && usersMap(userLogin.user_name,userLogin.password)===true){
                    //add new user
                    const response = await axios.post("http://localhost:3003/user/login", userLogin);
                    const token = response.data;
                    store.dispatch({type:AuthActionType.Login, payload:token});
                    navigate("/user")
                }else{
                    setAlert(true);
                }
        } catch (err: any) {
            console.log(err.message);
        }
    }
    return (
        <div className="Login">
            <form onSubmit={handleSubmit(send)}>
			<div className="Box">
                <h2>Login</h2>
                <div className = "Alert">{alertOn()}</div>
                <label>Select a user type</label>
                <select required {...register("typeUser")}>
                    <option>user</option>
                    <option>user</option>
                {/* {(store.getState().authReducer.userRole).map((item:string) => <option key={item}>{item}</option>)} */}
                </select>
                <label>Enter User Name</label>
                <input type="text" required {...register("user_name")}></input>
                <label>Enter Password</label>
                <input type="password" required {...register("password")}></input>
                <input required type="submit" value="Entrance"/>
                <p>Don't have an account?<NavLink to="/register"><h3>Register</h3></NavLink></p>
                <button onClick={()=> {
                    store.dispatch({type:AuthActionType.Logout, payload:null})}}>Log Out
                </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
