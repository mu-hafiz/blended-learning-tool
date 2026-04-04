import { Button } from "@components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FaArrowLeftLong, FaBug } from "react-icons/fa6";

type NotFoundProps = {
  title?: string;
  description?: string;
}

const NotFound = ({ title, description }: NotFoundProps) => {
  const navigate = useNavigate();
  const canGoBack = window.history.length > 1;

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="container 2xl:max-w-screen-xl">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center bg-surface-primary rounded-2xl w-full sm:w-130 p-6 pb-10">
            <h1>{title ?? "404: Page Not Found"}</h1>
            <h2>{description ?? "That doesn't seem to exist..."}</h2>
            <FaBug className="size-25 mt-5 mb-10" />
            <div className="flex flex-row gap-2">
              <Button
                variant="secondary"
                disabled={!canGoBack}
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <FaArrowLeftLong className="size-4 sm:size-5" />
                Go Back
              </Button>
              <Link to="/dashboard">
                <Button
                  className="gap-2"
                >
                  <AiFillHome className="size-4 sm:size-5" />
                  Go to Home
                </Button>
              </Link>
            </div> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;