import React, { useState } from 'react';

const ChangePasswordForm = () => {
    const [oldPassword, checkOldPassword] = useState('');
    const [password, newPassword] = useState('');
    const [passwordConfirm, confirmNewPassword] = useState('');

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const payload = {
        oldPassword: oldPassword.trim(),
        password: password.trim(),
        passwordConfirm: passwordConfirm.trim()
    };
    console.log(oldPassword)
    console.log(password)
    console.log(passwordConfirm)
    try {
        const response = await changePassword('http://localhost:5000/user/login', payload);
        console.log(response);   
        } catch (error) {
            console.error(error);
        }
    }
function changePassword(url = "", passwordChangeData = {}) {
        const authtoken = localStorage.getItem('accessToken')
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authtoken
        });
        
        return fetch(url, {
          method: 'PATCH',
          headers: myHeaders,
          body: JSON.stringify(passwordChangeData)
        })
        
        .then(response => {
            console.debug(response.status);
          if (response.status == 204) {
            return response.json();
          } else if (response.status == 403) {
            throw new Error('Hibás régi jelszó');
          } else if (response.status == 404) {
            throw new Error('A felhasználó nem található');
          } else {
            throw new Error('A régi és új jelszó nem egyezhet meg');
          }
        })
        .then(response => {
          console.debug(response);
          return response;
        }).catch(error => {
          console.error(error);
        });
    }
    return(
        <div>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Old Password:
                   <input type="password" name="oldPassword" value={oldPassword} onChange={e => checkOldPassword(e.target.value)} required />
                </label>
                <label>
                    New Password:
                    <input type="password" name="password" value={password} onChange={e => newPassword(e.target.value)} required />
                </label>
                <label>
                    Confirm New Password:
                    <input type="password" name="confirmPassword" value={passwordConfirm} onChange={e => confirmNewPassword(e.target.value)} required />
                </label>
                <button type="submit">Confirm new password</button>
            </form>
        </div>
    );
}

export default ChangePasswordForm;