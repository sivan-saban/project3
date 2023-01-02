import User from "../../Models/User";
import jwtDecode from "jwt-decode";

export enum UserRole{"Admin", "User", "Guest"};

//1. global state
export class AuthState{
    public user: User = new User();
    public token: string = "";
    public userRole:UserRole = UserRole.Guest;
}

//2. action type
export enum AuthActionType{
    Login = "Login",
    Logout = "Logout",
    Register = "Register",
}

//3. action
export interface AuthAction{
    type:AuthActionType;
    payload:any;
}

//4. reducer
//the action is getting an object that contain type and payload
export function authReducer(currentState = new AuthState(), action:AuthAction):AuthState{
    
    const newState = {...currentState};

    switch(action.type) {
        //they make the same
        case AuthActionType.Register: //get a token 
        case AuthActionType.Login:  
            newState.token = action.payload;
            //ממיר את הטוקן לאוביקט מסוג LoginModel
            const userLogin = jwtDecode<{user:User}>(newState.token);
            newState.user = userLogin.user;
            break;

        case AuthActionType.Logout:  
            newState.token = "";
            newState.userRole = UserRole.Guest;
            break;    
    }

    return newState;
}

