import { validatePassword } from "./password.js"

const nameInp = document.getElementById("name")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const toc = document.getElementById("toc")
const passwordConfirm = document.getElementById("password-confirm")
const inputs = document.getElementsByClassName("input-style")
const passwordCheckList = document.querySelectorAll(".list-item")
const container = document.querySelector(".strength-wrapper")



function validateEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Check if the email is not empty and matches the email pattern
  if (email.trim() === "") {
    return false
  } else if (!emailRegex.test(email)) {
    return false
  } else {
    return true
  }
}

function checkFocusEvent(input) {
  input.addEventListener(
    "focus",
    e => {
      if (e.currentTarget.getAttribute("name") === "password") {
        console.log(e.currentTarget.getAttribute("name"))
        document
          .querySelector(".password-checklist")
          .classList.add("show-checklist")
        validatePassword()
      }
      const parent = e.currentTarget.parentElement
      if (parent.lastElementChild.nodeName === "P") {
        parent.removeChild(parent.lastElementChild)
        input.classList.remove("error-shadow")
        input.classList.remove("success-shadow")
      }
    },
    true
  )
}

function checkBlurEvent(input) {
  input.addEventListener(
    "blur",
    e => {
      const name = e.currentTarget.name
      // check which input
      if (name === "name") {
        // check if input contain valid text
        if (input.value.trim()) {
          input.classList.remove("error-shadow")
          input.classList.add("success-shadow")
          return true
        } else {
          input.classList.remove("success-shadow")
          input.classList.add("error-shadow")
          // add error message
          const parent = input.parentElement
          const error = document.createElement("p")
          error.classList.add("error")
          error.innerText = `${name} is not  valid`
          parent.appendChild(error)
          return false
        }
      } else if (name === "email") {
        if (validateEmail(input.value)) {
          input.classList.remove("error-shadow")
          input.classList.add("success-shadow")
          return true
        } else {
          input.classList.remove("success-shadow")
          input.classList.add("error-shadow")
          // add error message
          const parent = input.parentElement
          const error = document.createElement("p")
          error.classList.add("error")
          error.innerText = `${name} is not  valid`
          parent.appendChild(error)
          return false
        }
      } else if (name === "password") {
        // check if input contain valid text

        if (input.value.trim()) {
          input.classList.remove("error-shadow")
          input.classList.add("success-shadow")
        } else {
          document
            .querySelector(".password-checklist")
            .classList.remove("show-checklist")
          input.classList.remove("success-shadow")
          input.classList.add("error-shadow")
          // add error message
          const parent = input.parentElement
          const error = document.createElement("p")
          error.classList.add("error")
          error.innerText = `${name} is not  valid`
          parent.appendChild(error)
        }
      } else if (name === "password-confirm") {
        const password = document.getElementById("password").value

        if (input.value.trim() && input.value === password) {
          input.classList.remove("error-shadow")
          input.classList.add("success-shadow")
          return true
        } else {
          input.classList.remove("success-shadow")
          input.classList.add("error-shadow")
          // add error message
          const parent = input.parentElement
          const error = document.createElement("p")
          error.classList.add("error")
          error.innerText = `${name} does not match password`
          parent.appendChild(error)
          return false
        }
      }
    },
    true
  )
}

const validateInput = input => {
  // remove success and error class when the input is focused
  checkFocusEvent(input)
  checkBlurEvent(input)
}
validateInput(inputs[0])
validateInput(inputs[1])
validateInput(inputs[2])
validateInput(inputs[3])

// validate form
function validateForm() {
  const passwordIsValid =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]?)(?=.*[0-9]?).{8,}$/.test(
      passwordInput.value
    )

  const nameIsValid =
    nameInp.value.replace(/\s+/g, "").length > 3 ? true : false
  const emailIsValid = validateEmail(emailInput.value)
  let passwordConfirmIsValid
  if (passwordInput.value.length >= 4) {
    passwordConfirmIsValid =
      passwordInput.value === passwordConfirm.value ? true : false
  }
  const tocIsValid = toc.checked ? true : false

  if (
    nameIsValid &&
    passwordIsValid &&
    passwordConfirmIsValid &&
    tocIsValid &&
    emailIsValid
  ) {
    document.getElementById("submit").disabled = false
    return true
  } else {
    document.getElementById("submit").disabled = true
    return false
  }
}

window.addEventListener(
  "click",
  e => {
    validateForm()
    // e.stopImmediatePropagation()
  },
  true
)

// submit inputs
const validForm = validateForm()

if (validForm){
  const form = document.querySelector("#form")
  form.submit()  
}

export {passwordCheckList, passwordInput, passwordConfirm, container}

// form.addEventListener("submit", async e => {
//   e.preventDefault()
//   const data = {
//     name: nameInp.value,
//     email: emailInput.value,
//     password: passwordInput.value,
//   }
//   const response = await fetch("http://localhost:5000/api/users", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: {
//       "Content-type": "application/json",
//       Accept: "application/json",
//     },
//   })
//   window.location.href='signin.html'
//   const result = await response.json()
//   console.log(result)
// })