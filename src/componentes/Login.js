import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  useEffect(() => {
    const disableBackButton = () => {
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener('popstate', () => {
        window.history.pushState(null, document.title, window.location.href);
      });
    };

    disableBackButton();

    return () => {
      window.removeEventListener('popstate', () => {});
    };
  }, []);

  function mostrarContraseñaAct() {
    setMostrarContraseña(!mostrarContraseña);
  }

  const inicio = (event) => {
    event.preventDefault();
    axios.post("http://localhost:8081/conexion", { email, password })
      .then((res) => {
        if (res.data.mensaje === "Inicio fallido") {
          Swal.fire("Error de inicio de sesión", "Verifica tus datos.", "error");
        } else {
          const {idAbogados, nombre, ocupacion } = res.data;
          Swal.fire("Inicio de sesión exitoso", `¡Bienvenido/a, ${nombre}!`, "success");
          if (ocupacion === "Gerente") {
            localStorage.setItem("ocupacion", ocupacion);
            window.location.href = "/menuad";
          } else if (ocupacion === "Abogado") {
            localStorage.setItem("ocupacion", ocupacion);
            localStorage.setItem("idAbogado", idAbogados);
            window.location.href = "/minimn";
          } else {
            Swal.fire("Error de inicio de sesión", "Verifica tus datos.", "error");
          }
        }
      })
      .catch((error) => {
        console.error("Error de conexión:", error);
        Swal.fire("Error de conexión", "No se pudo conectar al servidor.", "error");
      });
  };


  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <form onSubmit={inicio} className="bg-white p-4 rounded text-black shadow" style={{ width: "400px" }}>
        <img src="/Logo.png" alt="Logo" className="mb-4" />
        <h3 className="text-center pb-4 text-black">Inicio de sesión</h3>
        <div className="form-group">
          <div className="input-group mb-3">
            <label htmlFor="inEm" className="input-group-text">
              Email
            </label>
            <input type="email" className="form-control border border-black" id="inEm" onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div className="input-group mb-3">
            <label htmlFor="inPsw" className="input-group-text">
              Contraseña
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese contraseña"
              type={mostrarContraseña ? "text" : "password"}
              className="form-control"
              autoComplete="off"
            />
            <div className="input-group-append">
              <button onClick={mostrarContraseñaAct} type="button" className="btn btn-outline-secondary">
                {mostrarContraseña ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
        </div>
        <div className="text-center pt-4">
          <button type="submit" className="btn btn-primary btn-lg" style={{ backgroundColor: "#192DDF", paddingLeft: "100px", paddingRight: "100px" }}>
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
