// All the routes that connect the the DB and client.
import express, {NextFunction, Request, Response} from 'express';
import admin_logic from '../Logic/admin_logic';
import { checkJWT, getJWT, getUserNameFromJWT } from '../Utils/JWT';

// generic router 
const admin_router = express.Router();

// gets all admin
admin_router.get("/all", async (request: Request, response: Response, next: NextFunction) => {
  response.status(200).json( await admin_logic.getAllAdmins())
})


// add admin to DB
admin_router.post("/", async (request: Request, response: Response, next: NextFunction) => {
  const someData = request.body;
  response.status(201).json( await admin_logic.addAdmin(someData))
})

// delete admin from DB
admin_router.delete("/delete/:id", async (request: Request, response: Response, next: NextFunction) => {
  const someData = +request.params.id;
  response.status(204).json( await admin_logic.deleteAdmin(someData))
})

// update admin in DB
admin_router.put("/update", async (request: Request, response: Response, next: NextFunction) => {
  const body = request.body;
  response.status(201).json( await admin_logic.updateAdmin(body));
})
//vacation part: אני חושבת שצריך לחלק את הפעולות של חופשות
//get all vacations
admin_router.get("/vacation/all", async (request: Request, response: Response, next: NextFunction) => {
  response.status(200).json( await admin_logic.getAllVacations())
})
//get single vacation- not necessary
admin_router.get("/vacation/single/:id", async (request: Request, response: Response, next: NextFunction) => {
  const someData = +request.params.id;
  response.status(200).json( await admin_logic.getSingleVacation(someData))
})

// add vacation
admin_router.post("/vacation/", async (request: Request, response: Response, next: NextFunction) => {
  const someData = request.body;
  response.status(201).json( await admin_logic.addVacation(someData))
})

// delete vacation
admin_router.delete("/vacation/:id", async (request: Request, response: Response, next: NextFunction) => {
  const someData = +request.params.id;
  response.status(204).json( await admin_logic.deleteVacation(someData))
})

// update vacation
admin_router.put("/vacation/update", async (request: Request, response: Response, next: NextFunction) => {
  const body = request.body;
  response.status(201).json( await admin_logic.updateVacation(body));
})

admin_router.post("/login", async (request: Request, response: Response, next: NextFunction) => {
  let body = request.body;
     //check if we have a token in the header.....
     if (request.headers.authorization){    
      try{
        //תבדוק אם הטוקן בתוקף
          if (await checkJWT(request.headers.authorization)){
              response.status(202).json(`Welcome ${body.user}`);
          } else {
              response.status(401).json("unauthorized user...");
          }
      } catch (err:any){
          console.log(err);
          response.status(404).json("unauthorized user...");
      }
      return;
  } else {
      console.log("no token recived....")
  }
 //מה שכתוב כאן יהיה נכון אם אין לנו טבלה של אדמין, ולא נראלי שצריך לעשות את הבדיקה בלוגיק

 //בדיקת אימות שהמשתמש אכן הוא אדמין
if (body.user=="admin" && body.password=="password"){
  //קבל טוקן חדש ותתשלח את שם המשתמש, שזה הסיסמא שלי בעצם
  const token = getJWT(body.user);
  //תשלח- תראה את הטוקן החדש
  response.set("Authorization",`Bearer ${token}`);
  //הפונקציה ממירה את הטוקן לסטרינג ומאפשר לנו לראות את שם המשתמש אבל לא הבנתי בדיוק למה זה נחוץ
  console.log("user name:",getUserNameFromJWT(token));
  response.status(202).json("welcome" + getUserNameFromJWT(token));
} else {
  //אין לך הרשאה!!
  response.status(401).send("You are not authorized!!!!")
}


})

export default admin_router;