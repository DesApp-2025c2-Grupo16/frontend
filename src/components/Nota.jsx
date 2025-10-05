import { useState } from "react";

export default function Nota(props){
    const {nota} = props;
    const [mostrar, setMostrar] = useState(false);

    const toggleMostrar= ()=>{
        setMostrar(!mostrar)
    }

    return(
        <div className="row g-3 mb-2 align-items-center">
            <h4 className="col-11 text-dark" >
            {nota.fecha} - {nota.turno}
            </h4>
            <button className="col-1 btn btn-success mt-0" onClick={toggleMostrar}>Mostrar</button>
            {mostrar && <div className="card card-body mb-1">
                {nota.texto}
            </div>}
            
          </div>
    )

}