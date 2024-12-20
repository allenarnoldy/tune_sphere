import type { UserLogin } from '../interfaces/UserLogin.tsx';
import type { UserData } from '../interfaces/UserData.tsx';

const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('User information not retrieved, check network tab!');
    }

    return data;
  } catch (err) {
    console.log('Error from user login: ', err);
    return Promise.reject('Could not fetch user info');
  }
};


const signup = async (userInfo: UserData) => {
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error('User information not retrieved, check network tab!');
      }
  
      return data;
    } catch (err) {
      console.log('Error from user signup: ', err);
      return Promise.reject('Could not fetch user info');
    }
  };

export { login, signup };
