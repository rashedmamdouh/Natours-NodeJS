import axios from 'axios';
import '@babel/polyfill';
import {showAlert} from './alert'

//type is either 'password' or 'data'
export const updateSettings=async(data,type)=>{
    
    try{
        const url=
         type==='password'
                        ? '/api/v1/users/updatemypassword'
                        : '/api/v1/users/updateme'
      const res=await axios({
        method: 'PATCH',
        url,
        data
    })
    if(res.data.status==="success") {
        showAlert('success',`${type.toUpperCase()} Updated Succefully`)
        window.setTimeout(()=>{
          location.assign('/me')
        },1500);
    }
    }catch(err){
      showAlert('error',err.response.data.message)
    }
  }
  