// Toast controller
function showToast(message, isSuccess) {
    const toastContainer = document.getElementById('toast-container');
    const toastElement = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
  
    console.log(isSuccess)
    console.log(toastElement)
    // Set toast message and class
    toastMessage.textContent = message
    if(isSuccess){
      toastElement.classList.remove('is-error')
      toastElement.classList.add('is-success','toast-show');
    }else{
      toastElement.classList.remove('is-success')
      toastElement.classList.add('is-error','toast-show');
    }
  
    // Show toast
    setTimeout(function () {
      toastElement.classList.add('toast-hide');
    }, 3000);
  
    setTimeout(resetToast, 3010)
  }
  
  function hideToast() {
    const toastElement = document.getElementById('toast');
    toastElement.classList.remove('toast-show');
    toastElement.classList.add('toast-hide');
  }
  
  
  function resetToast(){
    // reset toast to default
    const toastElement = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
  
   
    toastElement.classList.remove('toast-hide');
    toastElement.classList.remove('toast-show');
    toastMessage.classList.remove('success')
    toastMessage.classList.remove('error')
  }
  
  