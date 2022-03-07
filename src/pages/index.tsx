import type { NextPage } from 'next';
import { useState } from 'react';

import { signUp } from '@/modules/next-auth-sanity/client';

const Home: NextPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <form>
        <input
          type='text'
          name='name'
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
        />

        <input
          type='text'
          name='email'
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
        />
        <input
          type='text'
          name='password'
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
        <button
          onClick={async (e) => {
            e.preventDefault();
            await signUp({ name, email, password });
          }}
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Home;
