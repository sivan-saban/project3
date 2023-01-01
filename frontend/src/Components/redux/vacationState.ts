import Vacation from "../../Models/Vacation";

export class VacationState{
    public vacations:Vacation[]=[];
}
export enum vacationActionType{
    getAllVacation="getAllVacation",
    deleteVacation="deleteVacation",
    addVacation="addVacation",
    updateVacation="updateVacation",
};

export interface VacationAction{
    type: vacationActionType;
    payload ?: any;
};

export function vacationReducer(
    //מיצר אוביקט בפעם הראשונה
    currentState:VacationState=new VacationState() ,
    action:VacationAction):VacationState{
        //שיכפול
    let newState = {...currentState};
    switch(action.type){

    case vacationActionType.getAllVacation:
        console.log(action);
        newState.vacations = action.payload;
    break;

    case vacationActionType.addVacation:
        newState.vacations.push(action.payload);
    break;

    case vacationActionType.updateVacation:
        newState.vacations.filter(item=> item.id == action.payload.id );
        newState.vacations.push(action.payload);
    break;

    case vacationActionType.deleteVacation:
        newState.vacations.filter(item=> item.id != action.payload );
    break;
}

return newState;
}