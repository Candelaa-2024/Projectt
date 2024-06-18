// validate password
const showPasswordBtn = document.querySelectorAll(".show-password")

showPasswordBtn.forEach(el => {
  el.addEventListener("click", () => {
    // toggle class
    el.classList.toggle("fa-eye")
    el.classList.toggle("fa-eye-slash")
    el.previousElementSibling.type =
      el.previousElementSibling.type === "password" ? "text" : "password"
  })
})

// let level = 0


let validationRegExp = [
  { regex: /.{8,}/ },
  { regex: /[0-9]/ },
  { regex: /[a-z]/ },
  { regex: /[A-Z]/ },
  { regex: /[\W_]/ },
]

function validatePassword() {
  let isPassValid
  passwordInput.addEventListener("input", () => {
    let level = 0
    let password = passwordInput.value
    validationRegExp.forEach((item, index) => {
      let isValid = item.regex.test(password)
      if (isValid) {
        level++
        passwordCheckList[index].classList.add("checked")
      } else {
        passwordCheckList[index].classList.remove("checked")
      }
    })
    if (password.length >= 10) {
      level++
    }
    if (password.length >= 16) {
      level++
    }

    if (password.length <= 3) {
      container.classList.remove("weak")
      container.classList.remove("medium")
      container.classList.remove("strong")
      container.classList.remove("very-strong")
    } else if (level < 4 && password.length > 3) {
      container.classList.add("weak")
      container.classList.remove("medium")
      container.classList.remove("strong")
      container.classList.remove("very-strong")
    } else if (level < 6) {
      container.classList.add("medium")
      container.classList.remove("weak")
      container.classList.remove("strong")
      container.classList.remove("very-strong")
    } else if (level < 7) {
      container.classList.add("strong")
      container.classList.remove("weak")
      container.classList.remove("medium")
      container.classList.remove("very-strong")
    } else if (level >= 7) {
      container.classList.add("very-strong")
      container.classList.remove("weak")
      container.classList.remove("medium")
      container.classList.remove("strong")
    }
    if (level <= 4) {
      isPassValid = false
    } else {
      isPassValid = true
    }
  })

  console.log(isPassValid)
}