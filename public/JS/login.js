
import { showAlert } from "./alert";
 export const login=async (email,password)=>{
    try{
            const res=await axios({
                method:'POST',
                url:'http://localhost:3000/api/v1/user/login',
                data:{
                    email:email,
                    password:password
                }
            })
            if(res.data.status==='success')
            {
                document.querySelector('.btn-login').textContent = 'Loading...';
               showAlert('success','Logged in successfully');
                window.setTimeout(()=>{
                    location.assign('/');
                },2000);
            }
        }
    catch(err)
    {
        showAlert('error',err.response.data.message);
    }    
   
}
  export const logout=async ()=>{
    try{
        const res=await axios({
            method:'GET',
            url:'http://localhost:3000/api/v1/user/logout'
        });
        if(res.data.status==='success')
        location.reload(true);
        location.assign('/');
    }
    catch(err)
    {
        showAlert('error','Error Logging out!Try again!');
    }
   
}
export const updateUser=async(form)=>{
    try{
        const res=await axios({
            method:'PATCH',
            url:'http://localhost:3000/api/v1/user/updateMe',
            
             data:form
        })
        if(res.data.status==='success')
        {
            showAlert('success','User Data successfully updated!');
            // location.reload(true);
            window.setTimeout(()=>{
                location.reload(true);
            },1500);
            
        }

    }
    catch(err){
        showAlert('error',err.response.data.message);
    }
}

export const updatePassword=async(currentPassword,password,confirmPassword)=>{
    try{
        const res=await axios({
            method:'PATCH',
            url:'http://localhost:3000/api/v1/user/updateMyPassword',
            data:{
                currentPassword:currentPassword,
                password:password,
                confirmPassword:confirmPassword
            }
        })
        if(res.data.status==='success')
        {
            showAlert('success','Password successfully updated!');
            // location.reload(true);
            
        }

    }
    catch(err){
        showAlert('error',err.response.data.message);
    }
}
