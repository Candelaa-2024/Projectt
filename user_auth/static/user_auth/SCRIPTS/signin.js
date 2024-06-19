// document.addEventListener("DOMContentLoaded", ()=> {
// // Get all variables
// const Email = document.getElementById("email")
// const Password = document.getElementById("password")
// const form = document.querySelector("form")

// form.addEventListener("submit", async(e)=>{
//     e.preventDefault()
//    const res = await fetch("http://localhost:8000/auth/login/", {
//     method: "POST",
//     body: JSON.stringify({email:Email.value, password:Password.value}),
//     headers: {
//       "Content-type": "application/json",
//       Accept: "application/json",
//     },
//   })
//   const result = await res.json()
//   showToast(result.message, !result.error);
//   if(!result.error){
//     window.location.href = "index.html" 
//   }
// },true)

// })