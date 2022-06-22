const contenedor = document.querySelector('#contenedor')
const contenedorCiudad = document.querySelector('#resultado')
const formulario = document.querySelector("#formulario");

document.addEventListener('DOMContentLoaded', () => {
    obtenerLocalizacion();
    formulario.addEventListener('submit', validarCiudades)
})
const obtenerLocalizacion = () => {
    const localizacion = navigator.geolocation;
    localizacion.getCurrentPosition(posicion, error);
};

const datosObj = {
  nombre: '',
  temperatura: '',
  max: '',
  min: '',
  estadoDia: '',
  humedad: '',
  pais: '',
  amanecer: '',
  anochecer: '',
  fecha: '',
  mes: '',
  ano: '',
  nombreDia: '',
};

const posicion = (position) => {
    console.log('Hola');
    const {latitude, longitude} = position.coords;
    mostrarDatos(latitude, longitude)
};

const error = () => {
  sacarLoad();
  mostrarError('No se puede mostrar los datos.', contenedor);
}

const mostrarDatos = async (latitude, longitude) => {
    try {
        const api = '47594b049d13bba0a5d653c652298139';
        const datos = await fetch(`https://api.openweathermap.org/data/2.5/weather?&units=metric&lat=${latitude}&lon=${longitude}&lang=es&appid=${api}`)
        const dataJson = await datos.json();
        const {dt,name} = await dataJson
        const {sunrise,sunset} = await dataJson.sys
        const {temp, temp_min, temp_max, humidity} = await dataJson.main
        const {description} = await dataJson.weather[0]
        await pasarDatos(name,temp,temp_max,temp_min,humidity,description)
        await pasarHora(sunrise,sunset)
        await pasarDia(dt)
        await mostrarContenido()
        sacarLoad()
    } catch (error) {
        console.log(error)
    }
}

const pasarDatos = async (name,temp,max,min,humidity,description,country) => {
      datosObj.nombre = name
      datosObj.temperatura = temp
      datosObj.max = max
      datosObj.min = min
      datosObj.estadoDia = description
      datosObj.humedad = humidity
      datosObj.pais = country
}

const pasarHora = async (salida, entrada) => {
    const diaSol = new Date(salida * 1000);
    const horaSol = diaSol.getHours();
    const minutosSol = diaSol.getMinutes();

    const diaLuna = new Date(entrada * 1000);
    const horaLuna = diaLuna.getHours();
    const minutosLuna = diaLuna.getMinutes();

    const saleSol = `0${horaSol}:${minutosSol}`
    const saleLuna = `${horaLuna}:${minutosLuna}`

    datosObj.amanecer = saleSol
    datosObj.anochecer = saleLuna
}

const pasarDia = async (fecha) => {
    const dia = new Date(fecha * 1000)
    const dias = dia.getDay();
    const numero = dia.getDate();
    const mes = dia.getMonth() + 1;
    const ano = dia.getFullYear();
    let nombreDia;
    switch(dias){
        case 0:
          nombreDia = 'Domingo';
          break;
        case 1:
          nombreDia = 'Lunes';
          break;
        case 2:
          nombreDia = 'Martes';
          break;
        case 3:
          nombreDia = 'Miercoles';
            break;
        case 4:
          nombreDia = 'Jueves';
          break;
        case 5:
          nombreDia = 'Viernes';
          break;
        case 6: 
        nombreDia = 'Sabado';
        break;
        default:
    };

    datosObj.fecha = numero
    datosObj.mes = mes
    datosObj.ano = ano
    datosObj.nombreDia = nombreDia
}

const mostrarContenido = () =>{
  const {nombre, nombreDia, fecha, ano, mes, temperatura, max, min, estadoDia, humedad, amanecer, anochecer} = datosObj

  const contenedor = document.querySelector('#contenedor')
  contenedor.classList.add('contenedor__datos')

  const nombreCiudad = document.createElement('H1');
  nombreCiudad.classList.add('titulo');
  nombreCiudad.innerHTML = `<span>El tiempo en:</span> ${nombre}`

  const fechaClima = document.createElement('P');
  fechaClima.classList.add('datos__fecha') ;
  fechaClima.textContent = `${nombreDia} ${fecha}/${mes}/${ano}`

  const grados = document.createElement('H2');
  grados.classList.add('temp');

  const temp = Math.round(temperatura)
  let tempMin;
  let tempMax;
  if(min == max){
    tempMin = min - 1;
    tempMax = max + 1
  }
  else{
    tempMin = Math.floor(min)
    tempMax = Math.ceil(max)
  }

  const dia = new Date()
  if(dia.getHours() <= 18 && dia.getHours() >= 7){
    grados.innerHTML = `${temp}°C<svg class="dia" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
  }
  else{
    grados.innerHTML = `${temp}°C<svg class="noche" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`
  }

  const descDia = document.createElement('H3');
  descDia.classList.add('datos__desc')
  descDia.textContent = estadoDia
  
  const maxmin = document.createElement('h3');
  maxmin.classList.add('datos__maxmin');
  maxmin.textContent = `Minima: ${tempMin}°C / Maxima: ${tempMax}°C`

  const Humedad = document.createElement('H3');
  Humedad.classList.add('humedad')
  Humedad.textContent = `Humedad: ${humedad}%`

  const contenedorHora = document.createElement('DIV');
  contenedorHora.classList.add('datos__salida');

  const salidaSol = document.createElement('H4')
  salidaSol.classList.add('sol')
  salidaSol.innerHTML = `Salida del sol: <span>${amanecer}</span><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;

  const puestaSol = document.createElement('H4')
  puestaSol.classList.add('luna');
  puestaSol.innerHTML = `Puesta del sol: <span>${anochecer}</span><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`

  contenedorHora.appendChild(salidaSol)
  contenedorHora.appendChild(puestaSol)

  contenedor.appendChild(nombreCiudad)
  contenedor.appendChild(fechaClima)
  contenedor.appendChild(grados)
  contenedor.appendChild(descDia)
  contenedor.appendChild(maxmin)
  contenedor.appendChild(Humedad)
  contenedor.appendChild(contenedorHora)

  formulario.addEventListener('submit', validarCiudades)
}

const sacarLoad = () => {
  const spinner = document.querySelector('#spinner')
  const contenedordos = document.querySelector('.contenedordos')

  spinner.style.display = 'none';

  contenedor.classList.remove('ocultar');
  contenedordos.classList.remove('ocultar')

  contenedordos.classList.add('mostrar')
  contenedordos.classList.add('mostrar')
}

const mostrarDatosCiudad = async (ciudad, pais) => {
  try {
      const api = '47594b049d13bba0a5d653c652298139';
      const datos = await fetch(`https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${ciudad},${pais}&lang=es&appid=${api}`)
      const dataJson = await datos.json();
      sppiner2()
      if(dataJson.cod == '404'){
        mostrarError('Ciudad erronea', formulario);
        return;
      }
      const {dt,name} = await dataJson
      const {temp, temp_min, temp_max, humidity} = await dataJson.main
      const {description} = await dataJson.weather[0]
      await pasarDatos(name,temp,temp_max,temp_min,humidity,description)
      await pasarDia(dt)
      limpiarHtml()
      mostrarContenidoCiudades()
  } catch (error) {
      console.log(error)
  }
}

const validarCiudades = (e) => {
  e.preventDefault();
  const formulario = document.querySelector("#formulario");
  const inputCiudad = document.querySelector('#ciudad').value.toLowerCase()
  const inputPais = document.querySelector('#pais').value
  const exp = /[a-z]{4,}\s*/
  if(exp.test(inputCiudad) && inputPais !== ''){
    mostrarDatosCiudad(inputCiudad, inputPais)
  }
  else mostrarError('Ambos campos tienen que estar completos', formulario)
}


const mostrarContenidoCiudades = () => {
  const {nombre, nombreDia, fecha, ano, mes, temperatura, max, min, estadoDia} = datosObj;
  
  contenedorCiudad.classList.add('contenedor__ciudad')
  contenedorCiudad.classList.add('mt')

  const nombreCiudad = document.createElement('H1');
  nombreCiudad.classList.add('titulo');
  nombreCiudad.innerHTML = `<span>El tiempo en:</span> ${nombre}`

  const fechaClima = document.createElement('P');
  fechaClima.classList.add('datos__fecha') ;
  fechaClima.textContent = `${nombreDia} ${fecha}/${mes}/${ano}`

  const grados = document.createElement('H2');
  grados.classList.add('temp');

  const temp = Math.round(temperatura)
  let tempMin;
  let tempMax;
  if(min == max){
    tempMin = Math.round(min - 1);
    tempMax = Math.round(max + 1)
  }
  else{
    tempMin = Math.round(min)
    tempMax = Math.round(max)
  }

  const dia = new Date()
  if(dia.getHours() <= 18 && dia.getHours() >= 7){
    grados.innerHTML = `${temp}°C<svg class="dia" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
  }
  else{
    grados.innerHTML = `${temp}°C<svg class="noche" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`
  }

  const descDia = document.createElement('H3');
  descDia.classList.add('datos__desc');
  descDia.textContent = estadoDia;
  
  const maxmin = document.createElement('h3');
  maxmin.classList.add('datos__maxmin');
  maxmin.textContent = `Minima: ${tempMin}°C / Maxima: ${tempMax}°C`;

  contenedorCiudad.appendChild(nombreCiudad)
  contenedorCiudad.appendChild(fechaClima)
  contenedorCiudad.appendChild(grados)
  contenedorCiudad.appendChild(descDia)
  contenedorCiudad.appendChild(maxmin)
}

const limpiarHtml = () => {
  while(contenedorCiudad.firstChild) contenedorCiudad.removeChild(contenedorCiudad.firstChild)
}

const sppiner2 = () => {
  limpiarHtml();
  const spiner = document.createElement('DIV');
  spiner.classList.add('loader');
  spiner.textContent = 'Loading...'
  contenedorCiudad.appendChild(spiner)
}

const mostrarError = (mensaje, padre) =>{
  const alerta = document.querySelector('.error')
  if(!alerta){
    const alerta = document.createElement('P');
    alerta.textContent = mensaje;
    alerta.classList.add('error');
    padre.appendChild(alerta)
    setTimeout(() => {
      alerta.remove()
    }, 3000);
  }
}