function getMessages(resp) {
    let ult = ''
    document.querySelector('main').innerHTML = ''
    messages = resp.data
    messages.forEach((element, index) => {
        if(index === messages.length - 1){
            ult = 'ult'
        }
        switch (element.type) {
            case 'status':
                document.querySelector('main').innerHTML += `<div class="message messageEntering ${ult}"><span>(${element.time}) <strong>${element.from}</strong> ${element.text}</span></div>`
                break;

            case 'message':
                document.querySelector('main').innerHTML += `<div class="message ${ult}"><span>(${element.time}) <strong>${element.from}</strong> para <strong>${element.to}:</strong> ${element.text}</span></div>`
                break;

            case 'private_message':
                document.querySelector('main').innerHTML += `<div class="message messagePrivate ${ult}"><span>(${element.time}) <strong>${element.from}</strong> reservadamente para <strong>${element.to}:</strong> ${element.text}</span></div>`
                break;
        }        
    })
    document.querySelector('.ult').scrollIntoView();
}
function registerUser() {
    const register = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', { name: user })
    register.catch((e) => {
        if (e.response.status === 400) {
            user = prompt('Este nome de usuário já está em uso.\nEscolha outro nome.')
            registerUser()
        }
    })
}

let user = prompt('Digite seu nome de usuário.')
registerUser()
setInterval(() => { axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: user }) }, 5000)

let messages
setInterval(() => {
    
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(getMessages);
}, 3000);
