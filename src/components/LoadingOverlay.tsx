import { useLoading } from "@providers/LoadingProvider";

export const LoadingOverlay = () => {
  const { loading, message } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="text-white text-lg animate-pulse">{message || "Loading..."}</div>
    </div>
  )
}