import moment from "moment";
import { types } from "../types/types";

const initialState = {
    events: [{
        title: new Date().getTime(),
        start: moment().toDate(),
        end: moment().add(2, "hours").toDate(),
        bgcolor: "#fafafa",
        user: {
          _id: '123',
          name: 'Martin Williner'
        }
    }],
    activeEvent: null,
};

export const calendarReducer = (state = initialState , action) => {

    switch (action.type) {
        case types.eventSetActive:
            return{
                ...state,
                activeEvent: action.payload
            }
        case types.eventAddNew:
            return{
                ...state,
                events:[
                    ...state.events,
                    action.payload
                ]
                
            }
        case types.eventClearActiveEvent:
            return {
                ...state,
                activeEvent: null
            }
        case types.eventUpdated:
            return {
                ...state,
                //como esta dentro de arreglo de events hay que usar un .map() para buscar el event a editar
                events: state.events.map(
                    e => (e.id === action.payload.id) ? action.payload : e
                )
            }
            case types.eventDeleted:
                return {
                    ...state,
                    
                    events: state.events.filter(
                        e => (e.id !== state.activeEvent.id)
                    ),
                    activeEvent: null
                }
        
        default:
            return state;
    }

};