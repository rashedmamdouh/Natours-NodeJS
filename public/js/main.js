import {login, logout} from './login'
import {updateSettings} from './updateSettings'
import {bookTour} from './stripe'
import {showAlert} from './alert'

const loginForm=document.querySelector('.form--login');
const logoutBtn=document.querySelector('.nav__el--logout');
const updateUserDataform=document.querySelector('.form--update-user-data');
const updateUserPassform=document.querySelector('.form--update-user-password');
const bookBtn=document.getElementById('book-tour');

if(loginForm){
    loginForm.addEventListener('submit',e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email, password);
    })
}

if(logoutBtn) logoutBtn.addEventListener('click',logout)


if(updateUserDataform) {
    updateUserDataform.addEventListener('submit', e => {
        e.preventDefault();
        const form=new FormData();
        form.append('name',document.getElementById('name').value)
        form.append('email',document.getElementById('email').value)
        form.append('photo',document.getElementById('photo').files[0])
        updateSettings(form,'data');
})
}

if(updateUserPassform) {
    updateUserPassform.addEventListener('submit',async e => {
        e.preventDefault();
        const currentPassword=document.getElementById('password-current').value;
        const newpassword=document.getElementById('password').value;
        const confirmPassword=document.getElementById('password-confirm').value;
        await updateSettings({currentPassword, newpassword,confirmPassword},'password');

        document.getElementById('password-current').value='';
        document.getElementById('password').value='';
        document.getElementById('password-confirm').value='';
})
}

if (bookBtn)
    bookBtn.addEventListener('click', e => {
      e.target.textContent = 'Processing...';
      const { tourId } = e.target.dataset;
      bookTour(tourId);
    });
    
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
