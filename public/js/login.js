import axios from 'axios';
import '@babel/polyfill';
import {showAlert} from './alert'

export const login = async(email, password) => {
    try{
   const res=await axios({
        method: 'post',
        url: 'http://localhost:3000/api/v1/users/login',
        data:{
            email,
            password
        }
    })
    if(res.data.status==="Success"){
      showAlert("success","Loged In Successfully");
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
      url: 'http://localhost:3000/api/v1/users/logout',
  })
  if(res.data.status==="success") {
    showAlert("success","Loged Out Successfully");
      window.setTimeout(()=>{
        location.assign('/')
      },1500);
  }
  }catch(err){
    showAlert('error',err.response.data.message)
  }
}



