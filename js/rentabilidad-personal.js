var socioId     = localStorage.getItem("socioId");
var socBtn      = $("#socioBtn");
var fidSel      = $("#fideicomisoSel");
var particip    = $("#participacionBtn");
var ocuMes      = $(".ocupacionMensual");
var ocuAn       = $(".ocupacionAnual");
var renMes      = $(".rentasMensual");
var renAn       = $(".rentasAnual");
// var depMes      = $(".depositosMensual");
// var depAn       = $(".depositosAnual");

var fideicomisos = [];

const base = 'http://ferranapi.com/api/';
const baseSocios = base + 'socios/';
const baseFidSoc = base + 'fideicomisossocios/';
const baseFid = base + 'fideicomisos/';

fidSel.change(function(){
    var fid = $("#fideicomisoSel option:selected").val();

    var api = baseFidSoc + fid + "/" + socioId;
    fetch(api)
        .then( res => res.json() )
        .then( fs => {
            if (fs.length === 1){
                particip.val((fs[0].participacion*100).toFixed(2) + '%');
            }
        });

    api = baseFid + fid;
    fetch(api)
        .then( res => res.json() )
        .then( f => {
            ocuMes.html((f.ocupacionMensual*100).toFixed(2) + '%');
            ocuAn.html((f.ocupacionAnual*100).toFixed(2) + '%');
            renMes.html('$ ' + f.rentasMensuales.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
            renAn.html('$ ' + f.rentasAnuales.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
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

function init(){
    getSocioName( socioId );
    getFideicomisos( socioId );
    
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var f=new Date();
    $('#fechaHoy').val(f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear());

}

init();
