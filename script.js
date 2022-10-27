var usuario = {name: ''};
var to = 'Todos';
var type = 'message';
var participants;

function entrando(){
    usuario.name = document.getElementById("insert_name").value;
    const entrando = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);

    entrando.then(sucesso);
    entrando.catch(erro);
}

function erro(resposta){
    alert("Nome de usuário inválido ou já registrado.");
    document.getElementById("insert_name").value = '';
}

function sucesso(resposta){
    document.querySelector(".tela_inicial").classList.add("hidden");
    console.log(resposta.data);
    setInterval(ativo, 5000);
    uptade_messages();
    setInterval(uptade_messages, 3000);
    uptade_participants();
    setInterval(uptade_participants, 10000);
}

function ativo(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
}

function uptade_messages(){
    
    document.getElementById('txt_box').onkeydown = function(e){
        if(e.keyCode == 13){
          enviar_mensagem();
        }
     };

    var mensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    mensagens.then(load);
    mensagens.catch(load_error);
}

function load(messages){
    document.querySelector(".messages").innerHTML = '';
    const mensagens = messages.data;
    for(let i=0; i<mensagens.length; i++){
        switch (mensagens[i].type){
            case "status":
                document.querySelector(".messages").innerHTML += `<li class="msg status">
                <span class="time">(${mensagens[i].time})</span>
                <span class="from">${mensagens[i].from}</span>
                <span class="text">${mensagens[i].text}</span>
                </li>`
                break
            case "message":
                document.querySelector(".messages").innerHTML += `<li class="msg message">
                <span class="time">(${mensagens[i].time})</span>
                <span class="from">${mensagens[i].from}</span>
                para
                <span class="to">${mensagens[i].to}</span>:
                <span class="text">${mensagens[i].text}
                </li>`
                break
            case "private_message":
                if (mensagens[i].to == usuario.name || mensagens[i].from == usuario.name){
                    document.querySelector(".messages").innerHTML += `<li class="msg private_message">
                    <span class="time">(${mensagens[i].time})</span>
                    <span class="from">${mensagens[i].from}</span>
                    reservadamente para
                    <span class="to">${mensagens[i].to}</span>:
                    <span class="text">${mensagens[i].text}</span>
                    </li>`
                }else{
                    console.log("DM para outro usuário");
                }
                break
            default:
                console.log("Mensagem inválida");
        }
    }
    document.querySelector(".messages").innerHTML += `<div class="auto_scroll"></div>`
    document.querySelector(".auto_scroll").scrollIntoView();
}

function load_error(resposta){
    console.log("Erro ao carregar mensagens: "+ resposta.response.status);
}

function uptade_participants(){
    participants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    participants.then(uptd);

    function uptd(content){
        users_online = content.data;
        document.querySelector(".contatos").innerHTML = `
        <li class="pointer users_check" onclick="selecionar_todos(${users_online.length})">
        <div>
        <ion-icon name="people" class="icon"></ion-icon> Todos

        </div>
        <ion-icon name="checkmark" class="check Todos"></ion-icon>
        
        </li>`

        for (let i = 0; i<users_online.length; i++){
            document.querySelector(".contatos").innerHTML += `
            <li class="pointer users_check" onclick="change_dm('${users_online[i].name}', ${users_online.length})">
            <div>
            <ion-icon name="person-circle" class="icon">
            </ion-icon>${users_online[i].name}
            </div>
            <ion-icon name="checkmark" class="check checkcontact user_${users_online[i].name.replace(/\s/g, '')} hidden"></ion-icon>
            </li>`
        }
        change_dm(to,users_online.length);
    }
}

function change_dm(towhom, size){
    to=towhom;
    for(let i=0; i<size; i++){
        document.querySelectorAll(".checkcontact")[i].classList.add("hidden");
    }
    document.querySelector(".user_"+towhom.replace(/\s/g, '')).classList.remove("hidden");
    if (to != "Todos"){
        document.querySelector(".Todos").classList.add("hidden");
    }
}
function selecionar_todos(size){
    to="Todos";
    for(let i=0; i<size; i++){
        document.querySelectorAll(".checkcontact")[i].classList.add("hidden");
    }
    document.querySelector(".Todos").classList.remove("hidden");


}

function toggle_options(){
    if (document.querySelector(".darken").classList.contains("hidden")){
        togglehidden();
    }else{
        setTimeout(togglehidden, 800);
    }
        function togglehidden(){
            document.querySelector(".darken").classList.toggle("hidden");
    }
    //alert(document.querySelector("darken"));
    document.querySelector(".darken").classList.toggle("hidden_darken");
    document.querySelector(".options").classList.toggle("hidden_options");
}

function enviar_mensagem(){
    let mensagem = document.getElementById("txt_box").value;
    if (mensagem != ''){
        if (type == 'message'){
            msg_obj = {
                from: usuario.name,
                to: 'Todos',
                text: mensagem,
                type: type
            }
        }else{
            msg_obj = {
                from: usuario.name,
                to: to,
                text: mensagem,
                type: type
            }
        }
        let msg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg_obj);
        console.log(msg_obj);
        msg.then(uptade_messages);
        msg.catch(usuario_deslogado);
        mensagem = '';

        document.querySelector(".msgwr").innerHTML = '';
        document.querySelector(".msgwr").innerHTML = `        <input type="input" class="lg1 txt_input" placeholder="Escreva aqui..." name="name" id="txt_box">
        <ion-icon class="lg1 pointer" name="paper-plane-outline" onclick="enviar_mensagem()"></ion-icon>`;
    }
}

function usuario_deslogado(){
    location.reload();
}

function alterar_visibilidade(para, visibilidade){
    to = para;
    if (visibilidade == 'private'){
        document.querySelector(".pub123").classList.remove("hidden");
        document.querySelector(".priv123").classList.add("hidden");
        type = 'message';
    }else{
        document.querySelector(".pub123").classList.add("hidden");
        document.querySelector(".priv123").classList.remove("hidden");
        type = 'private_message';
    }
}