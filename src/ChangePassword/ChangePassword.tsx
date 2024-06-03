import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUser, getUsers } from '../Profile/UserContext';

const ChangePasswordForm = () => {
    const navigate = useNavigate();
    const [oldPassword, checkOldPassword] = useState('');
    const [password, newPassword] = useState('');
    const [passwordConfirm, confirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
        oldPassword: oldPassword.trim(),
        password: password.trim(),
        passwordConfirm: passwordConfirm.trim()
    };
        if(password != passwordConfirm){
            toast("Password and confirm password doesn't match")
            return null;
        }
        if(oldPassword == password){
                toast("Old and new password doesn't match");
                return null;
        }else{
            try {
                const response = await changePassword(payload);
                if(response.status == 204){
                    toast("Password change successful")
                    navigate('/')
                }
                } catch (error) {
                if (error instanceof Error) {  
                    toast(`${error.message}`);
                    } else {
                    toast('Password change failed. Error unknown');
                    }
                }
            }
    }
    function ValidatePassword(inputPassword: string) {
        const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if(!regex.test(inputPassword)){
          setPasswordError('Invalid password format');
          return false;
      }
    setPasswordError('');
    return true;
    }
    interface passwordChangeData{
        oldPassword: string;
        password: string;
        passwordConfirm: string;
    }
      async function changePassword(passwordChangeData: passwordChangeData) {
        const authtoken = localStorage.getItem('accessToken')
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authtoken
        });
        
        const response = await fetch('http://localhost:5000/user/login', {
          method: 'PATCH',
          headers: myHeaders,
          body: JSON.stringify(passwordChangeData)
        })
        
        if(response.ok){
            return response;
        }else{
            const errorData = await response.json();
            throw new Error('Task failed: ' + errorData.message);
        }
    }
    return(
        <div>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Old Password:
                   <input type="password" name="oldPassword" value={oldPassword} onChange={e => checkOldPassword(e.target.value)} onBlur={(e) => {ValidatePassword(e.target.value)}} required />
                </label>
                <label>
                    New Password:
                    <input type="password" name="password" value={password} onChange={e => newPassword(e.target.value)} onBlur={(e) => {ValidatePassword(e.target.value)}} required />
                </label>
                <label>
                    Confirm New Password:
                    <input type="password" name="confirmPassword" value={passwordConfirm} onChange={e => confirmNewPassword(e.target.value)} onBlur={(e) => {ValidatePassword(e.target.value)}}  required />
                </label>
                {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
                <button type="submit">Confirm new password</button>
            </form>
        </div>
    );
}

export default ChangePasswordForm;