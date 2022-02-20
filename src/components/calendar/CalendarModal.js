import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import moment from "moment";
import DateTimePicker from 'react-datetime-picker';
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { uiCloseModal } from "../../actions/ui";
import { eventAddNew, eventClearActiveEvent, eventUpdated } from "../../actions/events";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const now = moment().minutes(0).seconds(0).add(1, 'hours'); // 3.00.00
const nowPlusOneHour = now.clone().add(1, 'hours');

const initialEvent = {
  title: '',
  notes:'',
  start: now.toDate(),
  end: nowPlusOneHour.toDate()
}

export const CalendarModal = () => {

    const {modalOpen} = useSelector(state => state.ui)
    const {activeEvent} = useSelector(state => state.calendar)
    const dispatch = useDispatch();

    const [dateStart, setDateStart] = useState(now.toDate())
    const [dateEnd, setDateEnd] = useState(nowPlusOneHour.toDate())
    const [titleValid, setTitleValid] = useState(true)

    const [formValues, setFormValues] = useState(initialEvent);

    const {notes, title, start, end} = formValues;

    useEffect(() => {
      if(activeEvent){
        setFormValues(activeEvent);
      } else {
        setFormValues(initialEvent);
      }
    
    }, [activeEvent, setFormValues])
    


    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]:target.value
        })
    };

  const closeModal = () => {
    dispatch(uiCloseModal());
    dispatch(eventClearActiveEvent())
    setFormValues(initialEvent)
  };

  const handleInicio = (e) => {
    setDateStart(e)
    console.log(e);

    setFormValues({
        ...formValues,
        start: e
    })
  }
  const handleFin = (e) => {
    setDateEnd(e)
    console.log(e);

    setFormValues({
        ...formValues,
        end: e
    })
  }

  const handleSubmitForm = (e) => {
      e.preventDefault();
      console.log(formValues)

      const momentStart = moment(start);
      const momentEnd = moment(end);

      if (momentStart.isSameOrAfter( momentEnd )) {
          Swal.fire('Error','La fecha de finalización debe ser mayor','error')
          return 
      }

      if (title.trim().length < 2 ) {
          return setTitleValid(false)
      }

      // if actualiza un evento existente
      if( activeEvent ) {
        dispatch(eventUpdated(formValues))
      } else { // else arma un nuevo evento
        dispatch(eventAddNew({
          ...formValues,
          id:new Date().getTime(),
          user:{
            _id: '456',
            name: 'Ezequiel'
          }
        }));
      }
      

      setTitleValid(true)
      closeModal()
  }

  return (
    <Modal
      isOpen={modalOpen}
      /* onAfterOpen={afterOpenModal} */
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    >
      <h1> {(activeEvent) ? 'Editar Evento' : 'Nuevo Evento'} </h1>
      <hr />
      <form className="container" onSubmit={handleSubmitForm}>
        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker onChange={handleInicio} value={dateStart} className="form-control"/>
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker onChange={handleFin} value={dateEnd} className="form-control" minDate={ dateStart }/>
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${!titleValid && 'is-invalid' }`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={title}
            onChange={handleInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={notes}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
