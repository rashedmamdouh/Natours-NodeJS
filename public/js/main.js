import {login, logout, signup,Review,Favourite} from './collection'
import {adminDeleteUser,adminCreateUser, adminUpdateUser} from './admin'
import {adminUpdateTour, adminDeleteTour, adminCreateTour } from './admin';
import {adminUpdateReview, adminDeleteReview, adminDeleteBooking} from './admin';
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
const adminDeleteUserBtns=document.querySelectorAll('.user-delete-button');
const adminCreateUserForm=document.querySelector('.form--adminCreateUser')
const userupdateBtns=document.querySelectorAll('.user-save-button');
const createTourForm = document.querySelector('.form--adminCreateTour');





if(loginForm || signUpForm ){
    if(loginForm){
        
        loginForm.addEventListener('submit',e=>{
            e.preventDefault();
            const email=document.getElementById('email').value;
            const password=document.getElementById('password').value;
            // const twoFactorCode=document.getElementById('secretCode').value;
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

        const type=(window.location.pathname.split('/')[1]==='reviewUpdateForm')? 'update':'create'

        const review=document.getElementById('review').value;
        const rating=document.getElementById('rating').value;
        const urlParts = window.location.pathname.split('/');
        const Id= urlParts[urlParts.length - 1]; // Get the last part of the path

        if(type==='update'){
        Review(review,rating,Id,'update') //Id===>ReviewId
        }else{
        Review(review,rating,Id,'create')//Id===>TourId
        }
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

    
if(adminDeleteUserBtns){
        for (const adminDeleteUserBtn of adminDeleteUserBtns) {
            adminDeleteUserBtn.addEventListener('click',async e =>{
                e.preventDefault();
                const userId=adminDeleteUserBtn.dataset.userId;
                adminDeleteUser(userId);
    })
}
}

userupdateBtns.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const userId = button.getAttribute('data-user-id');

        const name = document.getElementById(`name-${userId}`).value;
        const email = document.getElementById(`email-${userId}`).value;
        const role = document.getElementById(`role-${userId}`).value;

        adminUpdateUser(name,email,role,userId);
    });
});


if(adminCreateUserForm){
    adminCreateUserForm.addEventListener('submit',async e =>{
        e.preventDefault();
        const email=document.getElementById('emailfield').value;
        const name=document.getElementById('namefield').value;
        const password=document.getElementById('password').value;
        const confirmpassword=document.getElementById('confirm-password').value;
        const role=document.getElementById('rolefield').value;
        adminCreateUser(name,email, password,confirmpassword,role);
    })
}



if (createTourForm) {
    createTourForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // Get form field values
            const name = document.getElementById('namefield').value;
            const duration = parseInt(document.getElementById('durationfield').value, 10);
            const maxGroupSize = parseInt(document.getElementById('groupsizefield').value, 10);
            const price = parseFloat(document.getElementById('pricefield').value);
            const difficulty = document.getElementById('difficultyfield').value;
            const summary = document.getElementById('summaryfield').value;
            const description = document.getElementById('descriptionfield').value;
            const startLocation = document.getElementById('start-location-field').value;

            // Ensure the string is properly parsed as JSON
            let startDates = [];
            try {
                startDates = JSON.parse(document.getElementById('start-dates-field').value)
                    .map(dateStr => new Date(dateStr.trim()));
            } catch (parseError) {
                console.error("Failed to parse startDates JSON:", parseError);
            }

            // Parse locations JSON string into an array of objects
            let locations = [];
            try {
                locations = JSON.parse(document.getElementById('locations-field').value);
            } catch (parseError) {
                console.error("Failed to parse locations JSON:", parseError);
            }

            const guides = Array.from(document.getElementById('guides-field').selectedOptions)
                .map(option => option.value);

            // Prepare data object
            const data = {
                name,
                duration,
                maxGroupSize,
                price,
                difficulty,
                summary,
                description,
                startLocation,
                startDates,
                locations,
                guides
            };

            // Log data for debugging purposes
            console.log(data);

            // Call the function to create the tour
            adminCreateTour(data);

        } catch (error) {
            console.error("Error during form submission:", error.message);
            alert(`Form submission failed: ${error.message}`);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {

    // Handle save tour updates
    const saveButtons = document.querySelectorAll('.tour-save-button');
    saveButtons.forEach(button => {
        button.addEventListener('click', async e => {
            e.preventDefault();
            const tourId = button.getAttribute('data-tour-id');
            
            // Gather the updated data
            const name = document.getElementById(`name-${tourId}`).value;
            const duration = document.getElementById(`duration-${tourId}`).value;
            const price = document.getElementById(`price-${tourId}`).value;
            const difficulty = document.getElementById(`difficulty-${tourId}`).value;
            
            
            // Construct form data
            const formData = new FormData();
            formData.append('name', name);
            formData.append('duration', duration);
            formData.append('price', price);
            formData.append('difficulty', difficulty);
            
            // Send the update request
            await adminUpdateTour(formData,tourId);
            showAlert('success', 'Tour updated successfully!');
        });
    });


    // Handle delete tour
    const deleteButtons = document.querySelectorAll('.tour-delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async e => {
            e.preventDefault();
            const tourId = button.getAttribute('data-tour-id');

            // Confirm before deleting
            if (confirm('Are you sure you want to delete this tour?')) {
                await adminDeleteTour(tourId);
                showAlert('success', 'Tour deleted successfully!');
            }
        });
    })

});






document.addEventListener('DOMContentLoaded', () => {
    // Save review handler
    const saveButtons = document.querySelectorAll('.review-save-button');
    saveButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const reviewId = e.target.dataset.reviewId;
        const review = document.querySelector(`#review-${reviewId}`).value;
        const rating = document.querySelector(`#rating-${reviewId}`).value;
        const data={review,rating}
        adminUpdateReview(data,reviewId);
      })
    })

    // Delete review handler
    const deleteButtons = document.querySelectorAll('.review-delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const reviewId = e.target.dataset.reviewId;
  
        if (confirm('Are you sure you want to delete this review?')) {
            adminDeleteReview(reviewId);
        }
      });
});
});  






document.addEventListener('DOMContentLoaded', () => {
    // Delete booking handler
    const deleteButtons = document.querySelectorAll('.booking-delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const bookingId = e.target.dataset.bookingId;
  
        if (confirm('Are you sure you want to delete this booking?')) {
            adminDeleteBooking(bookingId)
    }
    })
})
});
 