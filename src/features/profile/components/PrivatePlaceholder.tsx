import { FaLock } from "react-icons/fa";

const PrivatePlaceholder = () => (
  <div className="flex flex-col flex-1 items-center justify-center">
    <FaLock size={100} className="mb-5"/>
    <h1>Private</h1>
    <h2>You are not permitted to view...</h2>
  </div>
);

export default PrivatePlaceholder;