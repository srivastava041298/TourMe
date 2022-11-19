import { showAlert } from "./alert";
export const signup = async (name, email, password, passwordConfirm) => {
    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/user/signup',
        data: {
          name:name,
          email:email,
          password:password,
          confirmPassword:passwordConfirm
        },
      });
  
      if (res.data.status === 'success') {
        document.querySelector('.sign-up').textContent = 'Loading...';
        showAlert('success', 'Account created and logged in successfully');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };
  