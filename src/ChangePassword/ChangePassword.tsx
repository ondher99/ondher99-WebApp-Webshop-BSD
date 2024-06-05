import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


const ChangePasswordForm = () => {
    const navigate = useNavigate();
    const [oldPassword, checkOldPassword] = useState('');
    const [password, newPassword] = useState('');
    const [passwordConfirm, confirmNewPassword] = useState('');
    const [oldpasswordError, setOldPasswordError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordEmptyError, setPassworEmptydError] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');

    type FieldErrorSetterMap = {
        [key: string]: React.Dispatch<React.SetStateAction<string>>;
    };

    const fieldErrorSetters: FieldErrorSetterMap = {
        oldPassword: setOldPasswordError,
        password: setPassworEmptydError,
        passwordConfirm: setPasswordConfirmError,
    };

    const checkIfEmpty = (fieldValue: string, fieldName: string) => {
        const setError = fieldErrorSetters[fieldName];
  
        if (!fieldValue.trim()) {
          setError(`${fieldName.replace(/\./g, ' ')} is required!`);
        } else {
          setError(''); // Clear the error if the field is not empty
        }
    };

    const validatePasswords = () => {
        // Check all password fields
        const isValidOldPassword = ValidatePassword(oldPassword);
        const isValidNewPassword = ValidatePassword(password);
        const isPasswordConfirmed = password === passwordConfirm;

        if (!isValidOldPassword || !isValidNewPassword) {
            toast.error("Passwords do not meet complexity requirements.");
            return false;
        }

        if (!isPasswordConfirmed) {
            setPasswordConfirmError('Passwords do not match!')
            toast.error("New password and confirmation do not match.");
            return false;
        }

        if (oldPassword === password) {
            toast.error("Old and new passwords cannot be the same.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPasswordError('');
        setPasswordConfirmError('');

        checkIfEmpty(oldPassword, 'oldPassword');
        checkIfEmpty(password, 'password');
        checkIfEmpty(passwordConfirm, 'passwordConfirm');

        if(!validatePasswords()) {
            return; // Stop submission if validation fails
        }

        const payload = {
            oldPassword: oldPassword.trim(),
            password: password.trim(),
            passwordConfirm: passwordConfirm.trim()
        };
        try {
            await changePassword(payload);            
        } catch (error) {
            if (error instanceof Error) {  
                toast(`${error.message}`);
            } else {
                toast.error('Password change failed. Error unknown');
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
        
        if (response.status === 204) {
            toast.success("Password changed successfully!");
            navigate('/')
        } else {
            const errorData = await response.json();
            toast.error(errorData.message || "An unexpected error occurred.");
        }
    }

    return(
        <div>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Old Password:
                   <input type="password" name="oldPassword" value={oldPassword} onChange={e => checkOldPassword(e.target.value)} onBlur={(e) => {ValidatePassword(e.target.value)}}/>
                </label>
                {oldpasswordError && <p style={{color: 'red'}}>{oldpasswordError}</p>}
                <label>
                    New Password:
                    <input type="password" name="password" value={password} onChange={e => newPassword(e.target.value)} onBlur={(e) => {ValidatePassword(e.target.value)}}/>
                </label>
                {passwordEmptyError && <p style={{color: 'red'}}>{passwordEmptyError}</p>}
                <label>
                    Confirm New Password:
                    <input type="password" name="confirmPassword" value={passwordConfirm} onChange={e => confirmNewPassword(e.target.value)} onBlur={(e) => {ValidatePassword(e.target.value)}}/>
                </label>
                
                {passwordConfirmError && <p style={{color: 'red'}}>{passwordConfirmError}</p>}
                {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
                <button type="submit">Confirm new password</button>
            </form>
            <ToastContainer/>
        </div>
    );
}

export default ChangePasswordForm;