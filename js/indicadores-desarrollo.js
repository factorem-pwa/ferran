
var fidSel      = $('#fideicomisoSel');
var socBtn      = $('#socioBtn');
var rentaM2     = $('.RentaM2');
var morosidad   = $('.Morosidad');
var cartInc     = $('.CarteraIncobrable');
var imgFid      = $('#imgFid');

var fideicomisos = [];

const base = 'http://ferranapi.com/api/';
const baseSocios = base + 'socios/';
const baseFid = base + 'fideicomisos/';

// evento que se dispara cuando cambia la selección en el combo de fideicomisos
fidSel.change(function(){
    var fid = $("#fideicomisoSel option:selected").val(); // obtiene el valor del elemento seleccionado en el combo de fideicomisos
    const api = baseFid + fid;
    fetch(api) // llama al API REST de fideicomisos con el id del fideicomiso seleccionado para obtener los datos de dicho fideicomiso
        .then( res => res.json() )
        .then( f => {
            rentaM2.html('$' + f.rentaM2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
            morosidad.html((f.morosidad*100).toFixed(2) + '%');
            cartInc.html((f.carteraIncobrable*100).toFixed(2) + '%');
            imgFid.attr("src","../img/" + f.rutaImagen);
        });
});

function getFideicomisos( socioId ) {
    fidSel.empty();

    const api = baseSocios + socioId + '/fideicomisos';
    fetch(api)
         .then( res => res.json() )
         .then( fids => {
            fideicomisos = fids;
            fids.forEach( fid => 
                fidSel.append(new Option(fid.name, fid.id)));
            fidSel.change();
         })
         .catch(err => { console.log (err);});
}

function getSocioName( socioId ){
    const api = baseSocios + socioId;
    fetch(api)
        .then ( res => res.json() )
        .then ( s => {
                        socBtn.val(s.name); 
                     }
              );
}

// obtiene el valor del campo <varname> del query string de la url de la página web
function getValue(varname) { 
	var url = window.location.href; 
	var qparts = url.split("?"); 
	if (qparts.length === 1) { return "Not found"; } // si no es un query string regresa no encontrado
	else{ 	
        var query = qparts[1]; 
        var vars = query.split("&"); 
        var value = ""; 
        var i;
        var found = false;
        for (i=0; i < vars.length; i++) // recorre los elementos del query string uno por uno
        { 
            var parts = vars[i].split("="); // separa cada elemento por el símbolo = que distingue el key del value
            if (parts[0] === varname) 
            { value = parts[1]; found = true; break; } 
	    } 
        if (!found) { return "Not found"; } // si no se encuentra el campo buscado en el query regresa no encontrado
		value = decodeURI(value); // limpia el valor del campo antes de devolverlo
		// Convert "+"s to " "s 
		value.replace(/\+/g," "); 
		return value; 
	} 
} 

function init(){
    var socio = getValue("uname");
    if (isNaN(socio)){ // viene de la ventana de rentabilidad personal leer el id del socio del localstorage
        socio = localStorage.getItem("socioId");
    }
    else{ // viene de la ventana de login guardar el socioId en el localstorage
        localStorage.setItem("socioId", socio);    
    }

    getSocioName(socio); // obtiene del REST API el nombre del socio y lo despliega en la página
    getFideicomisos(socio); // carga el combo de fideicomisos con el listado de los fideicomisos a los que tiene acceso el socio

    // desplegar la fecha de hoy en el encabezado de la página
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var f=new Date();
    $('#fechaHoy').val(f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear());
}

init();
