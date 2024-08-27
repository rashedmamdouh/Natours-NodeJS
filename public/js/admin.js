import axios from 'axios';
import '@babel/polyfill';
import {showAlert} from './alert'


export const adminDeleteUser = async(userId) => {
    try{
   const res=await axios({
        method: 'delete',
        url: `/api/v1/users/${userId}`,
    })
    
      showAlert("success","User Deleted Successfully");
      window.setTimeout(()=>{
        location.reload();
      },1500);
    
  }catch(err){
    showAlert('error',err.response.data.message)
  }
  }
  
  

  export const adminCreateUser=async(name,email,password,confirmPassword,role)=>{
    try{
      const res=await axios({
        method: 'POST',
        url: '/api/v1/users',
        data:{
          name,
          email,
          password,
          confirmPassword,
          role
      }
    })
    
    if(res.data.status==="success") {
      showAlert("success","User Created Successfully");
      window.setTimeout(()=>{
        location.reload();
      },1500);
    }
    }catch(err){
      showAlert('error',err.response.data.message)
    }
  }
  


  export const adminUpdateUser=async(name,email,role,userId)=>{
    try{
      const res=await axios({
        method: 'patch',
        url: `/api/v1/users/${userId}`,
        data:{
          name,
          email,
          role
      }
    })
    // console.log(res)
    if(res.data.status==="success") {
      showAlert("success","User Updated Successfully");
      window.setTimeout(()=>{
        location.reload();
      },1500);
    }
    }catch(err){
      showAlert('error',err.response.data.message)
    }
  }

  // //////////////////////////////////////////////////////////////////////////////////////////

  export const adminCreateTour=async(data)=>{
  
    try{
      const res=await axios({
        method: 'POST',
        url: '/api/v1/tours',
        data,
      
    })
    
    if(res.data.status==="success") {
      showAlert("success","Tour Created Successfully");
      window.setTimeout(()=>{
        location.reload();
      },1500);
    }
    }catch(err){
      console.log("err")
      showAlert('error',err.response.data.message)
    }
  }


  export const adminDeleteTour = async(tourId) => {
    try{
   const res=await axios({
        method: 'delete',
        url: `/api/v1/tours/${tourId}`,
    })
    
      showAlert("success","Tour Deleted Successfully");
      window.setTimeout(()=>{
        location.reload();
      },1500);
    
  }catch(err){
    showAlert('error',err.response.data.message)
  }
  }
  

  export const adminUpdateTour=async(data,tourId)=>{
    try{
      const res=await axios({
        method: 'patch',
        url: `/api/v1/tours/${tourId}`,
        data
    })
    console.log(res)
    if(res.data.status==="success") {
      showAlert("success","Tour Updated Successfully");
      window.setTimeout(()=>{
        location.reload();
      },1500);
    }
    }catch(err){
      showAlert('error',err.response.data.message)
    }
  }


   // //////////////////////////////////////////////////////////////////////////////////////////

  export const adminDeleteReview = async(reviewId) => {
    try{
   const res=await axios({
        method: 'delete',
        url: `/api/v1/reviews/${reviewId}`,
    })
    
      showAlert("success","Review Deleted Successfully");
      window.setTimeout(()=>{
        location.reload();
      },1500);
    
  }catch(err){
    showAlert('error',err.response.data.message)
  }
  }
  

  export const adminUpdateReview=async(data,reviewId)=>{
    console.log(data)
    try{
      const res=await axios({
        method: 'post',
        url: `/api/v1/reviews/${reviewId}`,
        data
    })
    // console.log(res)
    if(res.data.status==="success") {
      showAlert("success","Review Updated Successfully");
      window.setTimeout(()=>{
        location.reload();
      },1500);
    }
    }catch(err){
      showAlert('error',err.response.data.message)
    }
  }


  
   // //////////////////////////////////////////////////////////////////////////////////////////

   export const adminDeleteBooking = async(bookingId) => {
    try{
   const res=await axios({
        method: 'delete',
        url: `/api/v1/bookings/${bookingId}`,
    })
    
      showAlert("success","Booking Deleted Successfully");
      window.setTimeout(()=>{
        location.reload();
      },1500);
    
  }catch(err){
    showAlert('error',err.response.data.message)
  }
  }