$(document).ready( () => {
    listaTrataientos = '';
    //Listado de trataientos
    function list(){
        $.ajax({
            //url: 'http://localhost:8083/treatement/gettreatement?iduser=1',
            url: 'http://microtratamientos.herokuapp.com/treatement/gettreatement?iduser=1',
            type:'GET',
            dataType: 'json',
            success: function(res){
                console.log("RES "+res);    
                console.log(res.length);
                listaTrataientos = res;
                console.log("Lista de trat "+listaTrataientos);
                //window.alert("Actualemente tiene "+ res.length + " tratamientos activos.")                             
                data = "undefined";
                acordeon= 'TODOS LOS TRATAMIENTOS';
                res.forEach(element => {
                    console.log(element)
                    data+=`
                        <tr tratamientoId= ${element.idTratamiento} >
                            <td>${element.idTratamiento}</td>
                            <td>${element.namePill}</td>
                            <td>${element.hourstoTake}</td>
                            <td>${element.finishDate}</td>
                            <td>${element.daysCompleted}</td>
                            <td><button id="btntakepill" type="button" class="btn btn-success" >Tomar</button>                            
                            </td>
                        </tr>
                    `
                    acordeon+= `
                        <div class="accordion accordion-flush" id="accordionFlushExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="flush-headingOne">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                    Tratamiento ${element.idTratamiento}
                                    </button>
                                </h2>
                            <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                <div id="abody" class="accordion-body">
                                    <p><strong>id Tratamiento: </strong>${element.idTratamiento}</p>
                                    <p><strong>id Pill:</strong>${element.idPill}</p>
                                    <p><strong>Nombre: </strong>${element.namePill}</p>
                                    <p><strong>Pastillas disponibles: </strong>${element.available}</p>
                                    <p><strong>Estado: </strong>${element.totalStatus}</p>
                                    <p><strong>Descripcion: </strong>${element.statusDescription}</p>
                                    <p><strong>Amount: </strong>${element.amount}</p>
                                    <p><strong>Horas: </strong>${element.hourstoTake}</p>
                                    <p><strong>Empezo: </strong>${element.startDate}</p>
                                    <p><strong>Finaliza: </strong>${element.finishDate}</p>
                                    <p><strong>Dias Completos: </strong>${element.daysCompleted}</p>
                                    <p><strong>Dias Tratamiento: </strong>${element.daysTreatement}</p>

                                </div>
                            </div>
                        </div>
                    `
                    if(element.available == 0){
                        alert("No hay pastillas disponibles para tratamiento: "+ element.idTratamiento);
                    }
                });
                
                //Rcupero todo y me gusta. 
                $('#tbody').html(data);
                $('#accordionPanelsStayOpenExample').html(acordeon);
            }

        })
 
    }

    function save() {
        let horas =[];
        $('#btnAddTratamiento').on('click', function(){        
            horas[0]= $('#in_hourstoTake0').val();
            horas[1]= $('#in_hourstoTake1').val();
            


            if(listaTrataientos.length>8){
                alert('Ya no hay slots Disponibles');
            }else{
            const datosTratamientos = {
                idPill: parseInt($('#in_idPill').val()),
                amount: parseInt($('#in_amount').val()),
                hourToTake: horas,
                startDate: getHoy(),
                finishDate: getFinishDate(parseInt($('#in_daysTreatement').val())),
                daysCompleted: 1,
                daysTreatement: parseInt($('#in_daysTreatement').val()),
                iduser: parseInt(2),
                id: parseInt(14),
                available: parseInt($('#in_available').val()),
                status: "not_completed",
                statusDescription: "encurso"
            }
            
            $.ajax({
                //url: 'http://localhost:8083/treatement/addtreatement',
                url: 'http://microtratamientos.herokuapp.com/treatement/addtreatement',
                contentType: 'application/json; charset=utf-8',
                type: 'POST',
                crossDomain: true,
                data:JSON.stringify(datosTratamientos),
                dataType: 'json',
                success: () => {
                    alert('tratamiento registrado');
                }
            })
            console.log("impresion del json"+ JSON.stringify(datosTratamientos));
        }
        })
    }




    function tomarpastilla(){
        $(document).on('click','#btntakepill', function(){
            let btntakepill = $(this)[0].parentElement.parentElement;
            //id de tratamiento
            let id= $(btntakepill).attr('tratamientoId');            
            let datos='';
            listaTrataientos.forEach( obj => {
                if(obj.idTratamiento==id){
                    datos=obj;
                    if(datos.amount == 0){
                        alert("No disponede pastillas");
                    }                    
                }
                
            })
            //Update los tratamientos:
            const dataTratamiento ={
                    idPill: datos.idPill,
                    amount: datos.amount,
                    hourToTake: datos.hourstoTake,
                    startDate: datos.startDate,
                    finishDate: datos.finishDate,
                    daysCompleted: datos.daysCompleted+1,
                    daysTreatement: datos.daysTreatement-1,
                    iduser:1,
                    id: parseInt(id),
                    available:datos.available-datos.amount,
                    status:'not_completed',
                    statusDescription:'encurso'
                }

            $.ajax({
                url:'https://microtratamientos.herokuapp.com/treatement/updatetreatement',
                contentType: 'application/json; charset=utf-8',
                type: 'POST',
                crossDomain: true,
                data: JSON.stringify(dataTratamiento),
                dataType: 'json',
                success : () => {
                    alert("Tomo pastilla del tratamiento "+ id);
                    list();
                }

            })
            console.log(datos.hourstoTake);
            console.log("PRINT del json"+ JSON.stringify(dataTratamiento));
            list();

        })
    }
    


    function notificaciones(listaTrataientos){
        console.log("Revisando Si esta proxima una pastilla");  
        listaTrataientos.forEach( obj => {
           //console.log("idT: "+ obj.idTratamiento+ " horas: "+ obj.hourstoTake);
           if(getTime() == obj.hourstoTake[0] || getTime()== obj.hourstoTake[1] ){                            
                // simula una fecha 1 minuto adelante
                 const datedb = moment().add(1, 'minutes');                                 
                 // le restamos 2 minutos para que se muestre la notificacion 2 minutos antes
                 const custom = datedb.clone().subtract(2, 'minutes');
                 // diferencia en ms
                 //const diff = custom - moment();
                 setTimeout(() => {
                 alert('Tomar '+ obj.namePill+' a las: '+ obj.hourstoTake[1]);
                 }, 1000);
           }
        })
        
        
    }    
    

    function getTime() {
        let mytime = '18:30'
        let [h, m] = mytime.split(':');
        let date = new Date();
        //date.setHours(h, m, 0);
        dateresp= date.toString();
        dateresp = `${date.getHours()}:${date.getMinutes()}`
        //Devuelve 15:23 
        return dateresp;    
    }

    function getHoy(){
        let date = new Date();
        //date.setHours(h, m, 0);
        dateresp= date.toString();
        dateresp = `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()}`
        //Devuelve 12/23/2022
        console.log("Desde get hoy " + dateresp);
        return dateresp; 
    }

    function getFinishDate(num){
        let TuFecha = new Date(getHoy());
        
        //dias a sumar
        let dias = parseInt(num);
        
        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + dias);
        
        otro =` ${(TuFecha.getDate() - TuFecha.getDay() )}/${(TuFecha.getMonth() + 4) }/${TuFecha.getFullYear()}`
        console.log(otro+ typeof(otro));        
        return otro;
    }



     
    save();
    list();
    tomarpastilla();
    

    //Recorre las funciones de notificaciones cada 10 minutos
    var tope=0;
    var intervalo;
    function mensaje() {
    
        console.log("Revisando Si esta proxima una pastilla");  
        notificaciones(listaTrataientos);      
        tope++;
        if (tope>=10) {
            topo=0
        }
    }
    
    function intervalo() {
    //Cada 10 minutos busca pastillas 
        intervalo=setInterval(mensaje,120000);        
    }

    intervalo();
})
