var usuario = {name: ''};
function entrando(){
    usuario.name = prompt("Insira seu nome: ");
    const entrando = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);

    entrando.then(sucesso);
    entrando.catch(erro);
}

function erro(resposta){
    alert("Nome de usuário já registrado.");
    entrando();
}

function sucesso(resposta){
    console.log(resposta.data);
    setInterval(ativo, 5000);
    uptade_messages();
    setInterval(uptade_messages, 3000);
}

function ativo(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
}

function uptade_messages(){
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
                document.querySelector(".messages").innerHTML += `<li class="msg private_message">
                <span class="time">(${mensagens[i].time})</span>
                <span class="from">${mensagens[i].from}</span>
                reservadamente para
                <span class="to">${mensagens[i].to}</span>:
                <span class="text">${mensagens[i].text}</span>
            </li>`
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

entrando();

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
