import data from "../data.json" with { type: "json" }
const TBody = document.querySelector(".tbody")
const indexButtons = document.querySelector(".indexBtn")

const myData = data.slice(0,108)
let array = []
let array_length = 60
let table_size = 10
let start_index=1
let end_index=10
let current_index= 1
let max_index = 6
let sortCol = "id"
let filterBy; 



  function showActionDialog(item, dialogContainer) {
    document.querySelectorAll('.dialog')?.forEach((item)=>item.remove())
  const dialog = document.createElement("div")
  dialog.classList.add('dialog')
  dialog.innerHTML= `
      <button id="suspend-btn">Suspend</button>
      <button id="delete-btn">Delete</button>
      <button id="logout-btn">Logout</button>
   `

   dialogContainer.appendChild(dialog)
    const actionDialog = document.querySelector(".dialog");
    actionDialog.classList.add('show-dialog');
   
    const suspendBtn = document.getElementById("suspend-btn")
    const deleteBtn = document.getElementById("delete-btn")
    const logoutBtn = document.getElementById("logout-btn")

    suspendBtn.addEventListener("click", function () {
      console.log("Suspend user:", item.id)
      actionDialog.classList.toggle('show-dialog')
    })

    deleteBtn.addEventListener("click", function () {
      console.log("Delete user:", item.id)
      actionDialog.classList.toggle('show-dialog')
    })

    logoutBtn.addEventListener("click", function () {
      console.log("Logout user:", item.id)
      actionDialog.classList.toggle('show-dialog')
    })
  }

function preloadCalculation(){
  FilterTable()
  SortTable()
  if(filterBy){
    let tempArray = myData.filter((item)=>{
      return item.status = filterBy
    })
    array = tempArray
  }
array_length = array.length
max_index = array_length/table_size
if((array_length % max_index)>0){
  max_index++
}
}

function FilterTable (){
  const inputValue = document.querySelector("input[type=search]").value
   if(inputValue.trim()){
    let tempArray = myData.filter((item)=>{
      return item.id.toString().includes(inputValue)|| item.fullname.toString().includes(inputValue)
    })
    array= tempArray
   }else{
    array = data.slice(0,108)
   } 
}

function SortTable(){
 array.sort ((a,b)=> a[sortCol]> b[sortCol]? 1 : -1   )
}

function displayIndexButtons (){
  preloadCalculation()
  document.querySelectorAll(".indexBtn button").forEach((btn)=>btn.remove())
  const prevBtn = document.createElement('button')
  const nextBtn = document.createElement('button')
  prevBtn.textContent = 'Previous'
  nextBtn.textContent= 'Next'
  prevBtn.addEventListener('click',prevPage)
  nextBtn.addEventListener('click',nextPage)
  indexButtons.append(prevBtn)
  for(let i=1; i<= max_index; i++) {
    const button = document.createElement('button')
    button.innerText= i
    button.addEventListener('click',()=>indexPagination(i))
  indexButtons.append(button)
  }
  indexButtons.append(nextBtn)
  HighlightIndexButton()
 
}

function HighlightIndexButton (){
  start_index = ((current_index-1 )* table_size )+ 1
  end_index = (start_index + table_size) -1
  if(end_index > array_length){
    end_index = array_length
  }
  const allIndexBtn = document.querySelectorAll('.indexBtn button')
allIndexBtn.forEach((btn, ind)=>{
  btn.classList.remove("active")
  if(ind ===current_index){
    btn.classList.add("active")
  }
})

document.querySelector("footer span").textContent = `
  Showing ${start_index} to ${end_index} of ${array_length}
`
displayTableRows()
}

function displayTableRows(){
  document.querySelectorAll(".table .tbody .tr").forEach((row)=>{
    row.remove()
  })
  let start_tab = start_index-1;
  let end_tab = end_index
  for(let i=start_tab; i<end_tab; i++) {
 let item = array[i]
    const TR = document.createElement("div")
    TR.classList.add("tr")
    TR.innerHTML= `
    <span class="td">${item.id}</span>
    <span class="td">${item.fullname}</span>
    <span class="td">${item.ip_address}</span>
    <span class="td">${item.date}</span>
    <span class="td">${item.status}</span>
    <span class="td">${item.location}</span>
    <div class="dialog-container" >
    <span class="action-btn" data={${item.id} {}>...</span>
    </div>
    `
    const actionBtn = TR.querySelector(".action-btn")
    actionBtn.addEventListener("click", function () {
      
      const dialogContainer = TR.querySelector('.dialog-container')
      showActionDialog(item, dialogContainer)
  
    })
    TBody.appendChild(TR)
  }
 
}


function prevPage(){
  if(current_index>1){
    current_index--
    HighlightIndexButton()
  }
}
function nextPage(){
  if(current_index <max_index){
    current_index++
    HighlightIndexButton()
  }
}
function indexPagination(index){
  current_index = parseInt(index)
  HighlightIndexButton()
}


document.querySelector(".limit select").addEventListener("change", ( e)=>{
const value = e.target.value|| 10
table_size = parseInt(value)
start_index =1
current_index= 1
displayIndexButtons()
})


document.querySelectorAll('.tbody .tr .action').forEach((item, ind)=>{
  item.addEventListener('click',()=>{
    console.log(ind)
  })
})

displayIndexButtons()
document.querySelector("input[type=search]").addEventListener("keyup",()=>{
  setTimeout(()=>{
    start_index = 1
    current_index = 1
    displayIndexButtons()
  },300)
})

document.querySelector(".sort").addEventListener("change",(e)=>{
  sortCol = e.target.value
  start_index= 1
  current_index = 1
  displayIndexButtons()
})


document.querySelector("#active").addEventListener("change", (e)=>{
  if(e.target.checked){
    current_index = 1
    start_index = 1
    sortBy = "active"
    displayIndexButtons()
  }
})
document.querySelector("#inactive").addEventListener("change", (e)=>{
  if(e.target.checked){
    current_index = 1
    start_index = 1
    sortBy = "inactive"
    displayIndexButtons()
  }
})