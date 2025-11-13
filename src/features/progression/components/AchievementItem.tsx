type AchievementProps = {
  title: string,
  description: string,
  xp: number,
  imageUrl: string | null,
  unlocked?: boolean
}

const AchievementItem = ({title, description, xp, imageUrl, unlocked = false}: AchievementProps) => {
  return (
    <div className="h-25 bg-surface-tertiary rounded-xl flex items-center p-5">
      <div className="h-15 w-15 rounded-full bg-black" />
      <div className="ml-3 flex flex-col gap-1">
        <h3>{title}</h3>
        <p className="subtitle" title="This is a test">{description}</p>
      </div>
      {!unlocked && <h3>+{xp}XP</h3>}
    </div>
  )
};

export default AchievementItem;