import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Vacation from "../../Models/Vacation";
import MenuAdmin from "../MenuAdmin/MenuAdmin";
import { store } from "../redux/store";
import { vacationActionType } from "../redux/vacationState";
import "./addVacation.css";

function AddVacation(): JSX.Element {
    const { register, handleSubmit } = useForm<Vacation>();
    const [vacation, setVacation] = useState<Vacation>();
    const navigate = useNavigate();
    const params = useParams();
    const id = +(params.id || 0);
    var storageVacation = JSON.parse(localStorage.vacations);
    const [vacations, setVacations] = useState<Vacation[]>(storageVacation);

    // const handleFile = (f:any) => {
    //     f.preventDefault();
    //     setFile(f.target.files[0]);
    // }

    useEffect(() => {
        localStorage.setItem('vacations', JSON.stringify(vacations));
      }, [vacations]);
    
    useEffect(()=>{
        if (id > 0 ){
            const myVacation = (vacations.filter(vacation => vacation.id === id));
            setVacation(myVacation[0]);
            // axios.get(`http://localhost:3003/admin/vacation/single/${params.id}`)
            // .then(response => setVacation(response.data[0]));
        }
    },[]);
    
    const send = async (newVacation: Vacation) => {
        try {
            //params
            if (id === 0){
                //newVacation.vacation_img = (newVacation.vacation_img as unknown as FileList)[0];
                 // Tell axios that we're sending text and file to backend:
                const headers = { "Content-Type": "multipart/form-data" };
                await axios.post("http://localhost:3003/admin/vacation/",newVacation, { headers })
                .then(response=>{
                    const addVacation = response.data;
                //send a new vacation to redux-global state
                  store.dispatch({ type: vacationActionType.addVacation, payload: addVacation });
                    //update the localStorage
                    storageVacation.push(newVacation);
                    setVacations(storageVacation);
                    localStorage.setItem("vacations", JSON.stringify(vacations));
                    console.log(newVacation);
                    alert("vacation has been added.");
                    navigate("/admin");
                });
            }
            if(id>0){
                newVacation.id = id;
                newVacation.description = newVacation.description || vacation?.description;
                newVacation.destination = newVacation.destination || vacation?.destination;
                newVacation.price = newVacation.price || vacation?.price;
                newVacation.start_date = newVacation.start_date || vacation?.start_date;
                newVacation.end_date = newVacation.end_date || vacation?.end_date;
                await axios.put("http://localhost:3003/admin/vacation/update", newVacation)
                .then(res=>{
                    const addVacation = res.data;
                    store.dispatch({ type: vacationActionType.updateVacation, payload: addVacation });
                    //update the localStorage
                    storageVacation = storageVacation.filter((vacation: { id: number; })=> (vacation.id !== id));
                    storageVacation.push(newVacation);
                    setVacations(storageVacation);
                    localStorage.setItem("vacations", JSON.stringify(vacations));
                    navigate("/admin")
                });
            }
                
        } catch (err: any) {
            console.log(err.message);
        }
    }

    return (
        <div className="addVacation">
			<header><MenuAdmin/></header>
            <div className="Box">
                <form onSubmit={handleSubmit(send)}>
                    <h2>Add Vacation!</h2>

                    <label>destination:</label>
                    <input type="text" defaultValue={vacation?.destination} required {...register("destination")}/>

                    <label>description:</label>
                    <input type="text" defaultValue={vacation?.description} required {...register("description")}/>

                    <label>start_date:</label>
                    <input type="date" defaultValue={vacation?(new Date(vacation?.start_date)).toISOString().slice(0,10):""}  required {...register("start_date")}/>

                    <label>end_date:</label>
                    <input type="date" defaultValue={vacation?(new Date(vacation?.end_date)).toISOString().slice(0,10):""} required {...register("end_date")}/>

                    <label>price:</label>
                    <input type="number" defaultValue={vacation?.price} required {...register("price")}/>

                    <label>vacation_img:</label>
                    <input type="file" accept="image/*" {...register("vacation_img")}/>

                    <input type="submit" value="save vacation" style={{ height: 50, backgroundColor: "blue", borderRadius: 20 }} />
                </form>
            </div>
        </div>
    );
}

export default AddVacation;
