function registerUser() {
    const register = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', { name: user })
    register.catch((e) => {
        if (e.response.status === 400) {
            user = prompt('Este nome de usuário já está em uso.\nEscolha outro nome.')
            registerUser()
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
                if (element.to === user) {
                    document.querySelector('main').innerHTML += `<div class="message messagePrivate ${ult}"><span>(${element.time}) <strong>${element.from}</strong> reservadamente para <strong>${element.to}:</strong> ${element.text}</span></div>`
                }
                break;
        }
    })
    document.querySelector('.ult').scrollIntoView();
}
function sendMessage() {
    let msg = document.querySelector('.writeMessage').querySelector('textarea').value
    if (msg != '') {
        const send = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
            from: user,
            to: "Todos",
            text: msg,
            type: "message" // ou "private_message" para o bônus
        })
        send.then(() => {
            getMessages()
        })

        send.catch((err) => {
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
}

// //Register user
// let user = prompt('Digite seu nome de usuário.')
// registerUser()

// //Get messages
// let messages
// getMessages()

// //Refresh messages every 3 seconds
// setInterval(getMessages, 3000)

// //Keep user conected every 5 seconds
// setInterval(() => { axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: user }) }, 5000)