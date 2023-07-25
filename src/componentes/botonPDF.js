import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import imagen from "../Logo.png";

const MyDocument = ({id}) => {

  const [titulo,setTitulo] = useState('');
  const [subtitulo,setSubtitulo] = useState('');
  const [tipoJuicio,setTipoJuicio] = useState('');
  const [estadoExpediente,setEstadoExpediente] = useState('');
  const [descripcion,setDescripcion] = useState('');
  const[primerLugar,setPrimerLugar] = useState('');
  const [primeraFecha,setPrimeraFecha] = useState('');
  const [segundoLugar,setSegundoLugar] = useState('');
  const [segundaFecha,setSegundaFecha] = useState('');
  const [fechaRegistro,setFechaRegistro] = useState('');
  const [firma1,setFirma1] = useState('');
  const [firma2,setFirma2] = useState('');
  const [firma3,setFirma3] = useState('');
  const [firma4,setFirma4] = useState('');

  function loadData() {
    Axios.get(`https://server-api-6wm6.onrender.com/casos/${id}`)
      .then((response) => {
        setTitulo(response.data.Titulo);
        setSubtitulo(response.data.Subtitulo);
        setTipoJuicio(response.data.TipoJuicio);
        setEstadoExpediente(response.data.EstadoExpediente);
        setDescripcion(response.data.Descripcion);
        setPrimerLugar(response.data.PrimerLugar);
        setPrimeraFecha(response.data.PrimeraFecha);
        setSegundoLugar(response.data.SegundoLugar);
        setSegundaFecha(response.data.SegundaFecha);
        setFechaRegistro(response.data.fechaRegistro);
        setFirma1(response.data.PrimeraFirma);
        setFirma2(response.data.SegundaFirma);
        setFirma3(response.data.TerceraFirma);
        setFirma4(response.data.CuartaFirma);
      }).catch((err)=>{
        console.error(err);
      });
  }

  useEffect(() => {
    loadData();
  },[])

  const descargar = () => {

    const doc = new jsPDF();
    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();
    let Yactual;
    let limite;
    

    doc.setFontSize(12);

    doc.addImage(imagen,"PNG",((ancho - 100)/2),0,100,80);
    doc.setFontSize(20);
    doc.text(titulo,((ancho - doc.getTextWidth(titulo))/2),100);
    doc.setFontSize(17);
    doc.text(subtitulo,((ancho - doc.getTextWidth(subtitulo))/2),120);
    doc.setFontSize(12);
    doc.text(("Tipo de juicio: " + tipoJuicio),((ancho - doc.getTextWidth("Tipo de juicio: " + tipoJuicio))/2),140);
    doc.text(("Estado del expediente: "+ estadoExpediente),((ancho - doc.getTextWidth("Estado del expediente: " + estadoExpediente))/2),160);

    const lines = doc.splitTextToSize(descripcion,ancho - 40);
    Yactual = 180;
    limite = alto - Yactual - 20;

    let deNuevo = false;
    let splitDescripcion="";

    let textHeight;
    lines.forEach((line,index)=>{
      textHeight = doc.getTextDimensions(line, { fontSize: 12 }).h;
      limite = alto - 20;
      if(Yactual + textHeight >= limite){
        doc.addPage();
        Yactual = 20;
        deNuevo = true;
        splitDescripcion = "";
      }
      doc.text(line, (ancho - doc.getTextWidth(line)) / 2, Yactual);
      Yactual += 5;
      if(deNuevo){
        splitDescripcion += (line + '\n');
      }
    });
    if(!splitDescripcion || splitDescripcion === ""){
      splitDescripcion = descripcion;
    }

    const textDimensions = doc.getTextDimensions(splitDescripcion, {
      fontSize: 12,
      maxWidth: ancho - 40, 
    });

    Yactual = Yactual + textDimensions.h;
    limite = alto - Yactual;

    if(limite <= 20){
      doc.addPage();
      Yactual = 20;
      limite = alto - Yactual;
    }

    let x;

    if(!segundoLugar){
      x=2;
    }else{
      doc.text(segundoLugar,((ancho - doc.getTextWidth(segundoLugar))/1.5),Yactual);
      x=3.5;
    }

    doc.text(primerLugar,((ancho - doc.getTextWidth(primerLugar))/x),Yactual);

    Yactual += 20;
    limite -= 20;
    if(limite <= 20){
      doc.addPage();
      Yactual = 20;
      limite = alto - Yactual;
    }

    if(!segundaFecha){
      x=2;
    }else{
      doc.text(segundaFecha,((ancho - doc.getTextWidth(segundaFecha))/1.5),Yactual);
      x=3.5;
    }
    doc.text(primeraFecha,((ancho - doc.getTextWidth(primeraFecha))/x),Yactual);

    Yactual += 20;
    limite -= 20;
    if(limite <= 20){
      doc.addPage();
      Yactual = 20;
      limite = alto - Yactual;
    }

    doc.text(fechaRegistro,((ancho - doc.getTextWidth(fechaRegistro))/2),Yactual);

    Yactual += 20;
    limite -= 20;
    if(limite <= 20){
      doc.addPage();
      Yactual = 20;
      limite = alto - Yactual;
    }

    if(firma1){
      doc.text(firma1,((ancho - doc.getTextWidth(firma1))/2),Yactual);
      Yactual += 20;
      limite -= 20;
      if(limite <= 20){
        doc.addPage();
        Yactual = 20;
        limite = alto - Yactual;
      }
    }

    if(firma2){
      doc.text(firma2,((ancho - doc.getTextWidth(firma2))/2),Yactual);
      Yactual += 20;
      limite -= 20;
      if(limite <= 20){
        doc.addPage();
        Yactual = 20;
        limite = alto - Yactual;
      }
      if(firma3){
        doc.text(firma1,((ancho - doc.getTextWidth(firma3))/2),Yactual);
        Yactual += 20;
        limite -= 20;
        if(limite <= 20){
          doc.addPage();
          Yactual = 20;
          limite = alto - Yactual;
        }
        if(firma4){
          doc.text(firma4,((ancho - doc.getTextWidth(firma1))/2),Yactual);
          Yactual += 20;
          limite -= 20;
          if(limite <= 20){
            doc.addPage();
            Yactual = 20;
            limite = alto - Yactual;
          }
        }
      }
    }

    doc.save("expediente" + id + ".pdf");
  }
  
  return(
    <div>
      <button className='botonPDF'
      style={{
        margin: 0,
        width: '8%',
        backgroundColor: 'rgb(31, 126, 210)',
        color: 'white',
        borderRadius: '5px',
        border: '0',
      }} onClick={descargar}>descargar</button>
    </div>
  ); 
}

export default MyDocument;