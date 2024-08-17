import {login, logout, signup,createReview,Favourite} from './collection'
import {updateSettings} from './updateSettings'
import {bookTour} from './stripe'
import {showAlert} from './alert'


const loginForm=document.querySelector('.form--login');
const signUpForm=document.querySelector('.form--signup')
const logoutBtn=document.querySelector('.nav__el--logout');
const updateUserDataform=document.querySelector('.form--update-user-data');
const updateUserPassform=document.querySelector('.form--update-user-password');
const reviewForm=document.querySelector('.form--review');
const favBtn=document.querySelector('.fav-btn');
const bookBtn=document.getElementById('book-tour');



if(loginForm || signUpForm ){
    if(loginForm){
        
        loginForm.addEventListener('submit',e=>{
            e.preventDefault();
            const email=document.getElementById('email').value;
            const password=document.getElementById('password').value;

            login(email, password);
        })
    }
    else{
        signUpForm.addEventListener('submit',e=>{
            e.preventDefault();
            const email=document.getElementById('email').value;
            const name=document.getElementById('name').value;
            const password=document.getElementById('password').value;
            const confirmpassword=document.getElementById('confirm-password').value;
            signup(name,email, password,confirmpassword);
    })
    }

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


if(reviewForm){
    reviewForm.addEventListener('submit',async e => {
        e.preventDefault();
        const review=document.getElementById('review').value;
        const rating=document.getElementById('rating').value;
        const urlParts = window.location.pathname.split('/');
        const tourId= urlParts[urlParts.length - 1]; // Get the last part of the path

        createReview(review,rating,tourId)
})
}


if (favBtn) {
    const tourId = favBtn.dataset.tourId;
    document.addEventListener('DOMContentLoaded', () => {
    fetch(`/api/v1/tours/${tourId}/favorite-status`)
        .then(response => response.json())
        .then(data => {
            data.isFavorited===true? favBtn.classList.add('active') : favBtn.classList.remove('active');
        })
})

    favBtn.addEventListener('click', async e => { 
        if (favBtn.classList.contains('active')) {
            await Favourite(tourId, 'remove'); // Call API to remove from favorites
            favBtn.classList.remove('active'); // Update UI
            favBtn.textContent = 'Add to Favorites';
          } else {
            await Favourite(tourId, 'add'); // Call API to add to favorites
            favBtn.classList.add('active'); // Update UI
            favBtn.textContent = 'Remove from Favorites';
          }    
         })
    }
