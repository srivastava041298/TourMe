import {login , logout, updatePassword, updateUser} from './login';
import { signup } from './signup';
import { forgetPassword } from './forgetPassword';
import { passwordReset } from './resetPassword';
import { bookTour } from './stripe';

const loginForm=document.querySelector('.form-login');
const logoutForm=document.querySelector('.nav_el-logout');
const updatePasswordForm=document.querySelector('.updatePass');
const updateUserForm=document.querySelector('.form-user-data');
const signupForm = document.querySelector('.form--signup');
const forgetPasswordForm = document.querySelector('.form-forgetPass');
const resetPasswordForm = document.querySelector('.form--resetPass');
const bookBtn=document.getElementById('book-tour');


if(loginForm)
{
    loginForm.addEventListener('submit',e=>{
        e.preventDefault();
       
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        // console.log(email,password);
        login(email,password);
        });
}
if(logoutForm)
{
    logoutForm.addEventListener('click',logout);
}
if(updatePasswordForm)
{
    updatePasswordForm.addEventListener('submit',e=>{
        e.preventDefault();
        // document.querySelector('.btn-save-password').textContent='Updating...';
        const currentPassword=document.getElementById('password-current').value;
        const password=document.getElementById('password').value;
        const confirmPassword=document.getElementById('password-confirm').value;
        updatePassword(currentPassword,password,confirmPassword);
        document.getElementById('password-current').value='';
        document.getElementById('password').value='';
        document.getElementById('password-confirm').value='';
    });
}
// if(updateUserForm)
// {
//     updateUserForm.addEventListener('submit', e=>{
//     e.preventDefault();
//     const name=document.getElementById('name').value;
//     const email=document.getElementById('email').value;
//     updateUser(name,email);

//     })

// }
if(updateUserForm)
{
    updateUserForm.addEventListener('submit', e=>{
        e.preventDefault();
        const form=new FormData();
        form.append('name',document.getElementById('name').value);
        form.append('email',document.getElementById('email').value);
        form.append('photo',document.getElementById('photo').files[0]);
         updateUser(form);
        //  const name=document.getElementById('name').value;
        //  const email=document.getElementById('email').value;
        //  updateUser(name,email);
    })
}
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('password-confirm').value;
      signup(name, email, password, confirmPassword);
    });
  }
  if (forgetPasswordForm) {
    forgetPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      forgetPassword(email);
    });
  }
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('password-confirm').value;
      const token = document.querySelector('.btn-token').dataset.token;
      passwordReset(password,confirmPassword,token);
      // console.log(token);
    });
  }
  if(bookBtn)
  {
    bookBtn.addEventListener('click',e=>{
        e.target.textContent='processing...';
        const tourId=e.target.dataset.tourId;
        // console.log(tourId);
        bookTour(tourId);
    })
  }
  


