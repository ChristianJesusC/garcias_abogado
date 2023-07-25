import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyDocument from './botonPDF';

const LoadingAnimation = () => (
  <div className="vh-100 d-flex align-items-center justify-content-center">
    <Spinner animation="border" variant="primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </Spinner>
  </div>
);

const Descripcion = () => {
  const [expediente, setExpediente] = useState(null);
  const [datosCliente, setDatosCliente] = useState(null);
  const [infoAbogado, setInfoAbogado] = useState(null);
  const ocupacion = localStorage.getItem('ocupacion');
  const [idcaso,setIdCaso] = useState(0);

  useEffect(() => {
    const idCasos = localStorage.getItem('idCasos');
    const idClientes = localStorage.getItem('idClientes');
    const idAbogados = localStorage.getItem('idAbogado');

    if (idCasos && idClientes && idAbogados) {
      setIdCaso(idCasos);
      cargarExpediente(idCasos);
    }
  }, []);

  const redireccion = () => {
    if (ocupacion === 'Abogado') {
      window.location.href = '/lista';
    } else {
      window.location.href = '/listaG';
    }
  };

  const cargarExpediente = (idCasos) => {
    setTimeout(() => {
      axios
        .get(`https://server-api-6wm6.onrender.com/casos/${idCasos}`)
        .then((response) => {
          setExpediente(response.data);
          obtenerDatosCliente(response.data.idCliente);
          obtenerDatosAbogado(response.data.idAbogados);
        })
        .catch(() => {
          Swal.fire({
            title: 'ERROR',
            text: 'Fallo en la conexión',
            icon: 'warning',
          }).then((result) => {
            if (result.isConfirmed) {
              redireccion();
            }
          });
        });
    }, 1000);
  };

  const obtenerDatosCliente = (idClientes) => {
    axios.get(`http://localhost:8081/Obcliente/${idClientes}`)
      .then((response) => {
        setDatosCliente(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos del cliente:', error);
      });
  };

  const obtenerDatosAbogado = (idAbogados) => {
    axios.get(`http://localhost:8081/abogados/${idAbogados}`)
      .then((response) => {
        setInfoAbogado(response.data);
      })
      .catch((error) => {
        Swal.fire('Error', error, 'error');
      });
  };

  if (!expediente) {
    return <LoadingAnimation />;
  }

  const abogadoNombre = infoAbogado
    ? `${infoAbogado.nombre} ${infoAbogado.apePat} ${infoAbogado.apeMat}`
    : 'Sin abogado';

  return (
    <Container className="vh-100">
      <div
        className="bg-white"
        style={{
          boxShadow: '-1px 1px 28px 0px rgba(0,0,0,0.45)',
          WebkitBoxShadow: '-1px 1px 28px 0px rgba(0,0,0,0.45)',
          MozBoxShadow: '-1px 1px 28px 0px rgba(0,0,0,0.45)',
          paddingLeft: '50px',
          paddingRight: '45px',
          paddingTop: '10px',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
          Expediente {expediente.idCasos}
        </h1>
        <Row>
          <Col xs={6} md={4} className="text-end">
            <p>
              <strong>Código del Expediente:</strong> {expediente.idCasos}
            </p>
            <p>
              <strong>Fecha de Registro:</strong> {expediente.fechaRegistro}
            </p>
            <p>
              <strong>Tipo de Expediente:</strong> {expediente.TipoJuicio}
            </p>
            <p>
              <strong>Actor:</strong> {abogadoNombre}
            </p>
            <p>
              <strong>Demandado:</strong>{' '}
              {datosCliente
                ? `${datosCliente.Nombre} ${datosCliente.apePat} ${datosCliente.apeMat}`
                : 'Sin cliente registrado'}
            </p>
          </Col>
        </Row>
        <hr />
        <h3 style={{ marginTop: '40px' }}>{expediente.Titulo}</h3>
        <p>{expediente.Subtitulo}</p>
        <textarea disabled>{expediente.Descripcion}</textarea>
        <br /><br />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Row className="justify-content-center">
            {expediente.PrimeraFirma && (
              <Col>
                <p>
                  {expediente.PrimeraFirma}
                </p>
              </Col>
            )}
            {expediente.SegundaFirma && (
              <Col>
                <p>
                  {expediente.SegundaFirma}
                </p>
              </Col>
            )}
            {expediente.TerceraFirma && (
              <Col>
                <p>
                  {expediente.TerceraFirma}
                </p>
              </Col>
            )}
            {expediente.CuartaFirma && (
              <Col>
                <p>
                  {expediente.CuartaFirma}
                </p>
              </Col>
            )}
          </Row>
        </div>
        <br/>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Row>
              {expediente.PrimeraFecha && expediente.PrimerLugar && (
                <Col>
                  <p>
                    {expediente.PrimeraFecha}
                    <br />
                    {expediente.PrimerLugar}
                  </p>
                </Col>
              )}
              {expediente.SegundaFecha && expediente.SegundoLugar && (
                <Col>
                  <p>
                    {expediente.SegundaFecha}
                    <br />
                    {expediente.SegundoLugar}
                  </p>
                </Col>
              )}
          </Row>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button onClick={redireccion} variant="primary">Volver</Button>
          <br/>
          <br/>
          <MyDocument id={idcaso}/>
          <br/>
        </div>
      </div>
    </Container>
  );
};

export default Descripcion;