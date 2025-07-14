import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';

function Homepage() {
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

export default Homepage;
