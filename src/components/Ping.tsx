type PingProps = {
  show: boolean;
  offset?: number;
  corner?: "topRight" | "bottomRight" | "topLeft" | "bottomLeft";
  size?: number;
}

const Ping = ({ show, offset = 0, corner = "bottomRight", size = 12 }: PingProps) => {
  if (!show) return null;

  const offsetStyle: React.CSSProperties = {};
  if (corner === "bottomRight") {
    offsetStyle.bottom = `${offset}px`,
    offsetStyle.right = `${offset}px`
  } else if (corner === "bottomLeft") {
    offsetStyle.bottom = `${offset}px`,
    offsetStyle.left = `${offset}px`
  } else if (corner === "topLeft") {
    offsetStyle.top = `${offset}px`,
    offsetStyle.left = `${offset}px`
  } else if (corner === "topRight") {
    offsetStyle.top = `${offset}px`,
    offsetStyle.right = `${offset}px`
  }
  offsetStyle.width = size;
  offsetStyle.height = size;

  return (
    <>
      <div
        className="absolute bottom-0 right-0 bg-red-500 rounded-full"
        style={offsetStyle}
      />
      <div
        className="absolute bottom-0 right-0 bg-red-500 rounded-full animate-ping"
        style={offsetStyle}
      />
    </>
  )
};

export default Ping;