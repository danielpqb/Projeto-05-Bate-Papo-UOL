function registerUser() {
    document.querySelector('.lds-spinner').classList.toggle('hide')
    document.querySelector('.lgName').classList.toggle('hide')
    document.querySelector('.lgBtn').classList.toggle('hide')

    user = document.querySelector('.lgName input').value
    const register = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', { name: user })

    register.catch((e) => {
        if (e.response.status === 400) {
            document.querySelector('.loader').classList.toggle('hide')
            document.querySelector('.lgName').classList.toggle('hide')
            document.querySelector('.lgBtn').classList.toggle('hide')
            alert('Este nome de usuário já está em uso.\nEscolha outro nome.')
        }
    })
    register.then(() => {
        setTimeout(() => {
            document.querySelector('.login').classList.add('hide')
        }, 2000)
    })
}
function getParticipants() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(showParticipants);
}
function showParticipants(resp) {
    document.querySelector('.sbUsers').innerHTML = `
        <div class="sbUser" data-identifier="participant" onclick="checkUser(this)">
            <div class="sbUserData">
                <img src="img/person.svg" alt="">
                <h1>Todos</h1>
            </div>
            <div class="sbUserCheck hide">
                <img src="img/checkmark.svg" alt="">
            </div>
        </div>`

    participants = resp.data
    participants.forEach((element) => {
        document.querySelector('.sbUsers').innerHTML += `
        <div class="sbUser" data-identifier="participant" onclick="checkUser(this)">
            <div class="sbUserData">
                <img src="img/person.svg" alt="">
                <h1>${element.name}</h1>
            </div>
            <div class="sbUserCheck hide">
                <img src="img/checkmark.svg" alt="">
            </div>
        </div>`
    })

    document.querySelectorAll('.sbUserData h1').forEach((element) => {
        if (element.innerHTML == msgTo) {
            element.parentNode.parentNode.classList.add('check')
            element.parentNode.parentNode.querySelector('.hide').classList.remove('hide')
        }
    })
}
function getMessages() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(showMessages);
}
function showMessages(resp) {
    let ult = ''
    document.querySelector('main').innerHTML = ''
    messages = resp.data
    messages.forEach((element, index) => {
        if (index === messages.length - 1) {
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
                if (element.to === user || element.from === user) {
                    document.querySelector('main').innerHTML += `<div class="message messagePrivate ${ult}"><span>(${element.time}) <strong>${element.from}</strong> reservadamente para <strong>${element.to}:</strong> ${element.text}</span></div>`
                }
                break;
        }
    })
    document.querySelector('.ult').scrollIntoView();
}
function sendMessage() {
    const msg = document.querySelector('.writeMessage textarea').value
    if (msg != '') {
        console.log(msgType)
        if (msgType == 'Reservadamente' || msgType == 'private_message') {
            msgType = 'private_message'
        }
        else {
            msgType = 'message'
        }

        const send = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
            from: user,
            to: msgTo,
            text: msg,
            type: msgType // or "private_message"
        })
        send.then(() => {
            getMessages()
        })

        send.catch(() => {
            window.location.reload()
        })
    }
    document.querySelector('.writeMessage').querySelector('textarea').value = ''
}

function toggleSideBar() {
    document.querySelector('.sidebar').classList.toggle('hide')
    document.querySelector('.fakeSidebar').classList.toggle('hide')
}

function checkUser(user) {
    if (user.classList.contains('check')) {
        return
    }
    const users = document.querySelectorAll('.sbUser')
    users.forEach((element) => {
        if (element.classList.contains('check')) {
            element.querySelector('.sbUserCheck').classList.add('hide')
            element.classList.remove('check')
        }
    })
    user.querySelector('.sbUserCheck').classList.remove('hide')
    user.classList.add('check')

    msgTo = document.querySelector('.check .sbUserData h1').innerHTML
    document.querySelector('.writeMessage p').innerHTML = `Enviando para ${msgTo} (${msgType})`
}

function checkVisibility(visibility) {
    if (visibility.classList.contains('check')) {
        return
    }
    const visibs = document.querySelectorAll('.sbVisibility')
    visibs.forEach((element) => {
        if (element.classList.contains('check')) {
            element.querySelector('.sbVisibilityCheck').classList.add('hide')
            element.classList.remove('check')
        }
    })
    visibility.querySelector('.sbVisibilityCheck').classList.remove('hide')
    visibility.classList.add('check')

    msgType = document.querySelector('.check .sbVisibilityData h1').innerHTML
    document.querySelector('.writeMessage p').innerHTML = `Enviando para ${msgTo} (${msgType})`
}

//Common
let msgTo = 'Todos'
let msgType = 'Público'

//Register user
let user

//Get messages
let messages
getMessages()

//Get participants
getParticipants()
setInterval(getParticipants, 10000)

//Refresh messages every 3 seconds
getMessages()
setInterval(getMessages, 3000)

//Keep user conected every 5 seconds
setInterval(() => { axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: user }) }, 5000)

//Listen for 'ENTER' key while writing
let msgArea = document.querySelector('.writeMessage textarea')
msgArea.addEventListener("keypress", function (k) {
    if (k.key === "Enter") {
        k.preventDefault();
        sendMessage();
    }
});