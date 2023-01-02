import { IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Vacation from "../../Models/Vacation";
import "./vacationList.css";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import Pagination from '@mui/material/Pagination';
import { useNavigate } from "react-router";
import React from "react";
import { Pagination } from "@mui/material";
import { store } from "../redux/store";
import { vacationActionType } from "../redux/vacationState";
import Spinner from "../Spinner/Spinner";

//import ReactPaginate from 'react-paginate';

function VacationList(): JSX.Element {
    const navigate= useNavigate();
    const[vacations,setVacations]=useState<Vacation[]>([]);
    // const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(10);

    const pageCount = Math.ceil(vacations.length / 10);
    // const [page, setPage] = React.useState(1);

    useEffect(()=>{
        localStorage.setItem('vacations', JSON.stringify(vacations));
    },[vacations]);
   
    //const itemsPerPage=10;
        useEffect(()=>{      
            // setLoading(true);
            let storageVacation = JSON.parse(localStorage.vacations);
            console.log(storageVacation.length);
            
              // Take list vacation from store(redux):
            let allVacations = store.getState().vacationReducer.vacations;
            // if(storageVacation.length > 0){
            //setVacations(storageVacation);
            
            //if we don't have vacations on level app state so get it from server
            if(allVacations.length === 0){
                axios.get(`http://localhost:3003/admin/vacation/all`)
                .then(response=>{
                   //send all vacation into redux global state
                allVacations = response.data;
                store.dispatch({type:vacationActionType.getAllVacation, payload:allVacations}) 
                setVacations(allVacations);
                });
                //console.log("123");
                console.log(vacations);
            }
            // setLoading(false);
        },[currentPage]);



        const sortedVacations=vacations.sort((objA,objB)=>new Date(objB.start_date).getTime()-new Date(objA.start_date).getTime());
        // Get currCards
        const indexOfLastCard = currentPage * cardsPerPage;
        const indexOfFirstCard = indexOfLastCard - cardsPerPage;
        const currentCards = sortedVacations.slice(indexOfFirstCard, indexOfLastCard);

        // Change page
        const paginate = (pageNumber:any) => setCurrentPage(pageNumber);
        // console.log(cardsPerPage, movieCard.length, paginate);

        const handleChange = (event:any, value:any) => {
            setCurrentPage(value);
        };

    return (
        <div className="vacationList">
           {/* if thers no vacation, show me spinner */}
            { vacations.length === 0 && <Spinner /> }

            <div className="displayCard">
                <div className="card">
                {currentCards.map((item)=>
                    <div className="card-container" key={item.id} style={{ height: 360, width:250 }}>
                        <p>{item.destination}</p>
                        <p>{item.price}&#36;</p>
                        <img className="image" src={item.vacation_img} style={{height:150}}/>
                        <p>{new Date(item.start_date).toISOString().slice(8,10)}/{new Date(item.start_date).toISOString().slice(5,7)}/{new Date(item.start_date).toISOString().slice(0,4)} - {new Date(item.end_date).toISOString().slice(8,10)}/{new Date(item.end_date).toISOString().slice(5,7)}/{new Date(item.end_date).toISOString().slice(0,4)}</p>
                        <p>{item.description}</p>
                        <div className="Buttons">
                            <IconButton className="btn" aria-label="delete"  color="error" size="large" onClick={()=>{
                                    axios.delete(`http://localhost:3003/admin/vacation/${item.id}`);
                                    store.dispatch({type:vacationActionType.deleteVacation, payload:item.id}) 
                                    setVacations(vacations.filter(singleVacation=>singleVacation.id !== item.id));
                                }}>
                                <DeleteIcon/>
                            </IconButton>
                            <IconButton className="btn" aria-label="edit" color="success" onClick={() => {
                                    navigate(`/admin/addVacation/${item.id}`);
                                }}>
                                <EditIcon/>
                            </IconButton>
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <Pagination count={pageCount} page={currentPage} onChange={handleChange} />


        </div>

    );
}

export default VacationList;
