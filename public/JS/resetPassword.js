import { showAlert } from "./alert";
export const passwordReset = async (password,confirmPassword,token) => {
    try {
      const res = await axios({
        method: 'PATCH',
        url: `http://localhost:3000/api/v1/user/resetPassword/${token}`,
        data:{
            password:password,
            confirmPassword:confirmPassword
        }
        
      });
  
      if (res.data.status === 'success') {
        showAlert('success', 'Password Updated!');
        window.setTimeout(()=>{
            location.assign('/login');
        },1000);
        
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };