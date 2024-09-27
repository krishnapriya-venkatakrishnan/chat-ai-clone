import bot from './assets/bot.svg'
import user from './assets/user.svg'

function setVh() {
    const appElement = document.getElementById('app');

    // Set the height of the element to the inner height of the window
    appElement.style.height = `${window.innerHeight}px`;
}

// Initial set
setVh();

// Update the value on resize
window.addEventListener('resize', setVh);

const form = document.querySelector('form')
const chatContainerEl = document.querySelector('#chat-container')

const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const data = formData.get('prompt')
    chatContainerEl.innerHTML += chatStripe(false, data.trim())
    
    form.reset()

    const uniqueId = generateId()
    chatContainerEl.innerHTML += chatStripe(true, " ", uniqueId)
    chatContainerEl.scrollTop = chatContainerEl.scrollHeight;

    const currBotMessage = document.getElementById(uniqueId)
    const loaderIntervalId = loader(currBotMessage, uniqueId)

    // access the server
    const response = await fetch("https://chat-ai-clone.onrender.com/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data
        })
    })
    
    clearInterval(loaderIntervalId)
    currBotMessage.textContent = ''
    
    if (response.ok){
        const data = await response.json()
        const parsedData = data.bot.trim()
        responseLoader(currBotMessage, uniqueId, parsedData)
    } else {
        const err = await response.text()
        currBotMessage.innerHTML = "Something went wrong"
        alert(err)
    }
    
}

form.addEventListener('submit', handleSubmit)

const chatStripe = (isAi, message, messageId) => {
    
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                    src= ${isAi ? bot : user}
                    alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${messageId}>${message}</div>
            </div>
        </div>
        `
    )
}

const generateId = () => {
    const timeStamp = new Date().getDate()
    const random = Math.random()
    const hexadecimalString = random.toString(16)

    return `id-${timeStamp}-${hexadecimalString}`

}

const loader = (currBotMessage, messageId) => {
    currBotMessage.textContent = ''

    const loaderIntervalId = setInterval(()=> {
        currBotMessage.textContent += '.'
        if (currBotMessage.textContent === '....')
            currBotMessage.textContent = ''
    }, 300)
    return loaderIntervalId
}

const responseLoader = (currBotMessage, messageId, response) => {
    
    let index = 0
    
    const intervalId = setInterval(()=> {
        if (index < response.length){
            currBotMessage.textContent += response.charAt(index)
            index += 1
        } else {
            clearInterval(intervalId)
        }
    }, 20)
}