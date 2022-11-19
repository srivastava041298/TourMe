import { showAlert } from "./alert";
export const forgetPassword = async (email) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:3000/api/v1/user/forgetPassword',
        data:{
            email: email
        }
        
      });
  
      if (res.data.status === 'success') {
        showAlert('success', 'Password reset link sent to your email!');
        
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };