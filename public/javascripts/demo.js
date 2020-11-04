window.addEventListener("load", (event)=>{
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    document.getElementById('button').addEventListener('click', (event) => {
    email.value = 'demo@demo.com'
    password.value = 'Demo#123'
    })
//     console.log("hello from javascript!")
})
