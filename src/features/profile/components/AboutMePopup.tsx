const AboutMePopup = ({ aboutMe }: { aboutMe: string | null | undefined }) => {
  if (!aboutMe) return;
  return (
    <div className="overflow-y-auto">
      <h2 className="text-center mb-4">About Me:</h2>
      <hr className="divider" />
      <p className="whitespace-pre-wrap text-ellipsis">{aboutMe}</p>
    </div>
  );
}

export default AboutMePopup;