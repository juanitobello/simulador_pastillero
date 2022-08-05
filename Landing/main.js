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
                console.log(res.length+ " "+ res.type);
                listaTrataientos = res;
                console.log("Lista de trat "+listaTrataientos);
                //window.alert("Actualemente tiene "+ res.length + " tratamientos activos.")                             
                data = "undefined";
                res.forEach(element => {
                    console.log(element)
                    data+=`
                        <tr tratamientoId= ${element.idTratamiento} >
                            <td>${element.idTratamiento}</td>
                            <td>${element.namePill}</td>
                            <td>${element.hourstoTake}</td>
                            <td>${element.finishDate}</td>
                            <td>${element.daysCompleted}</td>
                            <td><button id="btntakepill" type="button" class="btn btn-success" >Tomar</button></td>
                        </tr>
                    `
                });
                
                //Rcupero todo y me gusta. 
                $('#tbody').html(data);
                //alert("Horas para tomar: "+ res[1].hourstoTake); 
                getTime(res)
                notificaciones(res);                
            }
        })
 
    }

    function save() {
        $('#btnAddTratamiento').on('click', function(){
            const datosTratamientos = {
                idPill: $('#idPill').val(),
                amount: $('#amount').val(),
                hourstoTake: $('#hourstoTake').val(),
                startDate: $('#startDate').val(),
                finishDate: $('#finish').val(),
                daysCompleted: 1,
                daysTreatement: 40,
                iduser:1,
                id:10,
                available: 12,
                status: "no completed",
                statusDescription: "encurso"

            }
                        
            $.ajax({
                url: 'http://localhost:8083/treatement/addtreatement' ,
                contentType: 'application/json',
                type: 'POST',
                data:JSON.stringify(datosTratamientos),
                dataType: 'json',
                success: (data) => {
                    console.log('Tratamiento tegistrado')                    
                }
            })
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
                
            });
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
                    id:id,
                    available:datos.available-1,
                    status:'not_completed',
                    statusDescription:'encurso'
                }

            $.ajax({
                url:'https://microtratamientos.herokuapp.com/treatement/updatetreatement',
                contentType: 'application/json',
                type: 'POST',
                crossDomain: true,
                data: JSON.stringify(dataTratamiento),
                dataType: 'json',
                success : () => {
                    alert("Tomo pastilla del tratamiento "+ id);
                }

            })
            console.log(datos.hourstoTake);
            console.log("PRINT del json"+ JSON.stringify(dataTratamiento));

        })
    }
    tomarpastilla();


    function notificaciones(res){
        // simula una fecha 1 minuto adelante
        const datedb = moment().add(1, 'minutes');
        // le restamos 50 segundos 
        const custom = datedb.clone().subtract(50, 'seconds');
        // diferencia en ms
        const diff = custom - moment();

        setTimeout(() => {
        alert('Tomar '+ res[0].namePill+' a las: '+ res[0].hourstoTake[1]);
        }, diff);
    }
    
    

    function getTime(res) {
        let mytime = '19:45'

        let [h, m] = mytime.split(':');
        let date = new Date();
        date.setHours(h, m, 0);
        resp= date.toString();
        resp = `${date.getHours()}:${date.getMinutes()}`

        console.log("Aqui transformar a horas " + resp);      
      
    }




     
    save();
    list();
    

    




    //Recorre las funciones de notificaciones cada 10 minutos
    var tope=0;
    var intervalo;
    function mensaje() {
    
        console.log("hola desde javascript");
        tope++;
        if (tope>=10) {
            topo=0
        }
    }
    
    function intervalo() {
    
        intervalo=setInterval(mensaje,10000);
    
    }
    mensaje();
    intervalo();
})
