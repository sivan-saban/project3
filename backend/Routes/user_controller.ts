// All the routes that connect the the DB and client.
import express, {NextFunction, Request, Response} from 'express';
import user_logic from '../Logic/user_logic';
import { getJWT } from '../Utils/JWT';


// generic router 
const user_router = express.Router();
// gets allלדעתי אין צורך
user_router.get("/all", async (request: Request, response: Response, next: NextFunction) => {
  response.status(200).json( await user_logic.getAllUsers())
})

user_router.get("/single/:id", async (request: Request, response: Response, next: NextFunction) => {
  const id = +request.params.id;
  response.status(200).json( await user_logic.getSingleUser(id))
})

//add user
user_router.post("/", async (request: Request, response: Response, next: NextFunction) => {
  const newUser = request.body;
  console.log(newUser);
  response.status(201).json( await user_logic.addUser(newUser))
})

// delete information from DB לדעתי אין צורך
user_router.delete("/:id", async (request: Request, response: Response, next: NextFunction) => {
  const someData = +request.params.id;
  response.status(204).json( await user_logic.deleteUser(someData))
})

// update information in DB
user_router.put("/update", async (request: Request, response: Response, next: NextFunction) => {
  const body = request.body;
  response.status(201).json( await user_logic.updateUser(body));
})

//REGISTER NEW USER
// user_router.post("/register", async (request: Request, response: Response, next: NextFunction) => {
//   const newUser = request.body;
//   console.log(newUser);
//   const token = getJWT(newUser.user_name);
//   //save in header
//   response.set("Authorization",`Bearer ${token}`);
//   response.status(201).json( await user_logic.addUser(newUser))
// })



export default user_router;