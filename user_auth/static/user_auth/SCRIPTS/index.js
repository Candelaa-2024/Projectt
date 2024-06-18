const  input = document.getElementById('password')
const container = document.querySelector(".strength-wrapper")
const form = document.querySelector('form')
const passwordCheckList = document.querySelectorAll(".list-item")
const generateBtn = document.querySelector('#generate-btn')
const clipboard = document.querySelector('#clipboard') 
    input.addEventListener(
      "focus",
      e => {
          document
            .querySelector(".password-checklist")
            .classList.add("show-checklist")
            validatePassword()
      }
    )
  
    input.addEventListener(
      "blur",
      e => {
        document
        .querySelector(".password-checklist")
        .classList.toggle("show-checklist")
        }
    )

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

let validationRegExp = [
    { regex: /.{8,}/ },
    { regex: /[0-9]/ },
    { regex: /[a-z]/ },
    { regex: /[A-Z]/ },
    { regex: /[\W_]/ },
  ]


  function validatePassword() {
    input.addEventListener("input", () => {
        console.log(input.value)
      let level = 0
      let password = input.value
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
    
    }
)}


// copy to clipboard
document.getElementById("copyButton").addEventListener("click", function() {
    var copyText = document.getElementById("copyText");
    copyText.select();
    document.execCommand("copy");
    document.getElementById("copyButton").innerText = "Copied";
    
    setTimeout(function() {
      document.getElementById("copyButton").innerText = "Copy";
    }, 2000); // Change back to "Copy" after 2 seconds
  });


//   generate strong password here
function generateStrongPassword() {
    const length = Math.floor(Math.random() * (24 - 16 + 1)) + 16; // Random length between 16 and 24 characters
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numericChars = '0123456789';
    const symbolChars = '!@#$%^&*()-_=+[{]}|;:,<.>/?';
  
    const allChars = uppercaseChars + lowercaseChars + numericChars + symbolChars;
  
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }
  
    return password;
  }

  generateBtn.addEventListener('click', ()=>{
    clipboard.classList.add('show-clipboard')
    const strongPasword = generateStrongPassword()
    document.querySelector('.copy-input').value = strongPasword
  })


form.addEventListener('submit', (e)=>{
    e.preventDefault()
   const password = input.value
   
   function isCommonPassword(password) {
    const commonPasswords = [
      '123456', 'password', '123456789', '12345678', '12345', '1234567', '1234567890', '123123', 
      'password1', 'abc123', '111111', '123456a', 'qwerty', 'password123', '1q2w3e', '1234', 
      '123', 'admin', 'letmein', 'welcome', 'love', 'monkey', 'shadow', 'master', '666666', 
      'qwerty123', 'google', '123qwe', 'football', '123123123', '123abc', '987654321', 'zxcvbnm', 
      'passw0rd', 'fuckyou', 'trustno1', 'dragon', '123654', 'baseball', 'superman', '123qweasd',
      
    ];
    return commonPasswords.includes(password);
  }
  const result = isCommonPassword(password) 
  console.log(result)
  if(result){
    showToast("Your password is vulnerable to attack. Please try again", false)
  }else{
    showToast("Your password is secured from the dictionary attack", true)
  }
}
)
