import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Vacation from "../../Models/Vacation";
import MenuAdmin from "../MenuAdmin/MenuAdmin";
import "./addVacation.css";

function AddVacation(): JSX.Element {
    const { register, handleSubmit } = useForm<Vacation>();
    const [file, setFile] = useState("");
    const navigate = useNavigate();
    const handleFile = (f:any) => {
        f.preventDefault();
        setFile(f.target.files[0]);
    }

    const send = async (newVacation: Vacation) => {
        try {
                await axios.post("http://localhost:3003/admin/vacation/",newVacation,
                )
                .then(res=>{
                    console.log(newVacation);
                    navigate("/admin/report");
                });
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
                    <input type="text" {...register("destination")}/>

                    <label>description:</label>
                    <input type="text" {...register("description")}/>

                    <label>start_date:</label>
                    <input type="date" {...register("start_date")}/>

                    <label>end_date:</label>
                    <input type="date"  {...register("end_date")}/>

                    <label>price:</label>
                    <input type="text" {...register("price")}/>

                    <label>vacation_img:</label>
                    <input type="file" onChange={handleFile}/>

                    <input type="submit" value="save vacation" style={{ height: 50, backgroundColor: "blue", borderRadius: 20 }} />
                </form>
            </div>
        </div>
    );
}

export default AddVacation;