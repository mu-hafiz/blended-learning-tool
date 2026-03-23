import { useLoading } from "@providers/LoadingProvider";
import { CgSpinner } from "react-icons/cg";

export const LoadingOverlay = () => {
  const { loading, message } = useLoading();

  return (
    <div className={`
      fixed inset-0 z-50 flex flex-col items-center justify-center
      backdrop-blur-sm transition-all duration-1000
      ${loading ? "bg-black/50" : "bg-black/0 opacity-0 pointer-events-none"}
      `}>
      <CgSpinner size={75} className="animate-spin" />
      <div className="text-white text-lg animate-pulse">{message || "Loading..."}</div>
    </div>
  )
}