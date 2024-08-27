import axios from 'axios';
import '@babel/polyfill';
import {showAlert} from './alert'

export const login = async(email, password) => {
    try{
   const res=await axios({
        method: 'post',
        url: '/api/v1/users/login',
        data:{
            email,
            password,
            // twoFactorCode
        }
    })
    if(res.data.status==="success"){
      showAlert("success","Welcome Back");
      window.setTimeout(()=>{
        location.assign('/')
      },1500);
    }
  }catch(err){
    showAlert('error',err.response.data.message)
  }
}
  
export const logout=async()=>{
  try{
    const res=await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
  })
  if(res.data.status==="success") {
    showAlert("success","Good Bye");
      window.setTimeout(()=>{
        location.assign('/')
      },1500);
  }
  }catch(err){
    showAlert('error',err.response.data.message)
  }
}


export const signup=async(name,email,password,confirmPassword)=>{
  try{
    console.log(name,email,password,confirmPassword)
    const res=await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data:{
        name,
        email,
        password,
        confirmPassword,
    }
  })
  if(res.data.status==="success") {
    showAlert("success","Welcome to Our Natours Community !");
      window.setTimeout(()=>{
        location.assign('/')
      },1500);
  }
  }catch(err){
    showAlert('error',err.response.data.message)
  }
}




export const Review=async(review,rating,id,type)=>{
  try{
    const url=
    type==='create'? 
      `/api/v1/reviews/createReview/${id}`
      : `/api/v1/reviews/${id}`

      const data = {
        review,
        rating,
      };
  
      if (type === 'create') {
        data.tour = id;
      }
    const result =await axios({
      method: 'POST',
      url,
      data
  })
  console.log(url,result)
  if (result.data.status === "success") {
    showAlert("success", `Review ${type} Successfully`);
    window.setTimeout(() => {
      location.assign('/my-reviews') // Redirects to the previous page
    }, 1500);
  }  
}catch(err){
  showAlert('error',err.response.data.message)
}
}


export const Favourite=async(tourId,type)=>{
  try{
    const url=
     type==='add'? 
    `/api/v1/tours/addtofav/${tourId}` :
    `/api/v1/tours/removefromfav/${tourId}`

    const result =await axios({
      method: 'POST',
      url: url
  })
  if (result.data.status === "success") {
    showAlert("success", `Favourite Tour ${type} Successfully `);
  }  
}catch(err){
  showAlert('error',err.response.data.message)
}
}
