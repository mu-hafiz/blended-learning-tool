import './App.css';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className='mb-10'>A Blended Learning Tool</h1>
      <div className='flex flex-row gap-2 justify-center'>
        <Button
          variant="secondary"
          className="w-25"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
        <Button
          variant="primary"
          className="w-25"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
      </div>

    </>
  )
}

// function App() {
//   const [profiles, setProfiles] = useState<Profile[]>([]);

//   useEffect(() => {
//     getUser();
//   }, [])

//   async function getUser() {
//     const { data } = await supabase.from("profiles").select();
//     if (!data) {
//       throw new Error('Could not fetch profile');
//     }
//     setProfiles(data);
//   }

//   return (
//     <ul>
//       {profiles.map((profile) => (
//         <li key={profile.first_name}>{profile.first_name}</li>
//       ))}
//     </ul>
//   )
// }

export default App
