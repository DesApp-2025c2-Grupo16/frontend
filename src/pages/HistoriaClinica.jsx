// src/pages/HistoriaClinica.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import Nota from "../components/Nota.jsx";

const INIT = [
  { id: 1, clas: "Afiliado", nombre: "Juan P.",    situacion: "Discapacidad", notas: ["02/09/2025 - Control traumatólogo"] },
  { id: 2, clas: "Hijo/a",   nombre: "Martina P.", situacion: "Embarazo (4 meses)", notas: [] },
  { id: 3, clas: "Esposo/a", nombre: "Paula S.",   situacion: "Migraña", notas: [] },
];

const juan = {nombre: "Juan", apellido: "Perez", situaciones: ["Discapacidad"] };

const notasInit = [
  {id:1, fecha: "01/06/2024", idPrestador: 1, turno:"Control traumatologico", texto:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, cum maxime quia dolor ipsum libero quod incidunt minus eum suscipit eius praesentium qui voluptatem, exercitationem consequatur atque, nam sit inventore sequi! Asperiores, aspernatur commodi est delectus facilis voluptas esse praesentium porro soluta doloribus omnis facere impedit. Quibusdam sint accusamus adipisci magni commodi nostrum recusandae velit vitae? Animi maxime a doloremque nihil molestiae. Aliquam temporibus quia, quod repellat praesentium ex, aliquid voluptatibus reprehenderit commodi adipisci a doloribus, eligendi minus inventore! Fuga sint unde tempora quaerat repellendus quae ipsam voluptas voluptates enim. Assumenda debitis perspiciatis veniam quae rerum nesciunt ipsa autem. Maiores?"},
  {id:2, fecha: "21/09/2024", idPrestador: 1, turno:"Control traumatologico", texto:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, cum maxime quia dolor ipsum libero quod incidunt minus eum suscipit eius praesentium qui voluptatem, exercitationem consequatur atque, nam sit inventore sequi! Asperiores, aspernatur commodi est delectus facilis voluptas esse praesentium porro soluta doloribus omnis facere impedit. Quibusdam sint accusamus adipisci magni commodi nostrum recusandae velit vitae? Animi maxime a doloremque nihil molestiae. Aliquam temporibus quia, quod repellat praesentium ex, aliquid voluptatibus reprehenderit commodi adipisci a doloribus, eligendi minus inventore! Fuga sint unde tempora quaerat repellendus quae ipsam voluptas voluptates enim. Assumenda debitis perspiciatis veniam quae rerum nesciunt ipsa autem. Maiores?"},
  {id:3, fecha: "11/12/2024", idPrestador: 1, turno:"Control traumatologico", texto:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, cum maxime quia dolor ipsum libero quod incidunt minus eum suscipit eius praesentium qui voluptatem, exercitationem consequatur atque, nam sit inventore sequi! Asperiores, aspernatur commodi est delectus facilis voluptas esse praesentium porro soluta doloribus omnis facere impedit. Quibusdam sint accusamus adipisci magni commodi nostrum recusandae velit vitae? Animi maxime a doloremque nihil molestiae. Aliquam temporibus quia, quod repellat praesentium ex, aliquid voluptatibus reprehenderit commodi adipisci a doloribus, eligendi minus inventore! Fuga sint unde tempora quaerat repellendus quae ipsam voluptas voluptates enim. Assumenda debitis perspiciatis veniam quae rerum nesciunt ipsa autem. Maiores?"},
  {id:4, fecha: "14/03/2025", idPrestador: 1, turno:"Control traumatologico", texto:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, cum maxime quia dolor ipsum libero quod incidunt minus eum suscipit eius praesentium qui voluptatem, exercitationem consequatur atque, nam sit inventore sequi! Asperiores, aspernatur commodi est delectus facilis voluptas esse praesentium porro soluta doloribus omnis facere impedit. Quibusdam sint accusamus adipisci magni commodi nostrum recusandae velit vitae? Animi maxime a doloremque nihil molestiae. Aliquam temporibus quia, quod repellat praesentium ex, aliquid voluptatibus reprehenderit commodi adipisci a doloribus, eligendi minus inventore! Fuga sint unde tempora quaerat repellendus quae ipsam voluptas voluptates enim. Assumenda debitis perspiciatis veniam quae rerum nesciunt ipsa autem. Maiores?"},
  {id:5, fecha: "05/06/2025", idPrestador: 1, turno:"Control traumatologico", texto:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, cum maxime quia dolor ipsum libero quod incidunt minus eum suscipit eius praesentium qui voluptatem, exercitationem consequatur atque, nam sit inventore sequi! Asperiores, aspernatur commodi est delectus facilis voluptas esse praesentium porro soluta doloribus omnis facere impedit. Quibusdam sint accusamus adipisci magni commodi nostrum recusandae velit vitae? Animi maxime a doloremque nihil molestiae. Aliquam temporibus quia, quod repellat praesentium ex, aliquid voluptatibus reprehenderit commodi adipisci a doloribus, eligendi minus inventore! Fuga sint unde tempora quaerat repellendus quae ipsam voluptas voluptates enim. Assumenda debitis perspiciatis veniam quae rerum nesciunt ipsa autem. Maiores?"},
  {id:6, fecha: "16/09/2025", idPrestador: 1, turno:"Control Traumatologico", texto:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, cum maxime quia dolor ipsum libero quod incidunt minus eum suscipit eius praesentium qui voluptatem, exercitationem consequatur atque, nam sit inventore sequi! Asperiores, aspernatur commodi est delectus facilis voluptas esse praesentium porro soluta doloribus omnis facere impedit. Quibusdam sint accusamus adipisci magni commodi nostrum recusandae velit vitae? Animi maxime a doloremque nihil molestiae. Aliquam temporibus quia, quod repellat praesentium ex, aliquid voluptatibus reprehenderit commodi adipisci a doloribus, eligendi minus inventore! Fuga sint unde tempora quaerat repellendus quae ipsam voluptas voluptates enim. Assumenda debitis perspiciatis veniam quae rerum nesciunt ipsa autem. Maiores?"},
]



export default function HistoriaClinica(){
  //const {id} = props;
  const [paciente, setPaciente] = useState(juan);
  const [notas, setNotas] = useState(notasInit);

  return (
    <div className="row g-3">
      {/* Header con volver */}
      <div className="col-12 d-flex align-items-center gap-2 text-center">
        <BackButton to="/afiliados" title="Volver a Afiliados" />
        <h2 className="col-11 mb-0 bg-dark rounded-5">Historia Clínica</h2>
      </div>
      <div className="col">
        <h1 className="text-dark fw-bold">
          Paciente: {paciente.nombre} {paciente.apellido}
        </h1>
      </div>

      <div className="col-12">
        {notas.map(nota => (
          <Nota key={nota.id} nota={nota} />
        ))}
      </div>
    </div>
  );
}
