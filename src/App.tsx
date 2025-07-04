import { useState, useEffect } from 'react';
import './App.css';
import { supabase } from '@lib/supabaseClient';

import type { Profile } from '@models/tables';

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    getUser();
  }, [])

  async function getUser() {
    const { data } = await supabase.from("profiles").select();
    if (!data) {
      throw new Error('Could not fetch profile');
    }
    setProfiles(data);
  }

  return (
    <ul>
      {profiles.map((profile) => (
        <li key={profile.first_name}>{profile.first_name}</li>
      ))}
    </ul>
  )
}

export default App
