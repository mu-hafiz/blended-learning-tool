const AccountPreferences = () => {
  return (
    <form className="m-2 mt-4">
      <h2>Themes</h2>
      <p className="text-secondary-text">Choose the perfect theme for you!</p>
      <hr className="border-surface-secondary my-3"/>
      <h2 className="mb-3">Light Mode</h2>
      <div className="bg-base border-2 border-neutral-50 rounded-2xl w-30 h-30 relative cursor-pointer">
        <div className="bg-surface-primary rounded-xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-22 h-22">
          <div className="bg-surface-secondary rounded-md absolute top-3 left-1/2 -translate-x-1/2 w-16 h-7"/>
          <div className="bg-surface-tertiary rounded-md absolute top-12 left-1/2 -translate-x-1/2 w-16 h-7"/>
        </div>
      </div>
      <h2 className="mt-5 mb-3">Dark Mode</h2>
      <div className="bg-base border-2 border-neutral-50 rounded-2xl w-30 h-30 relative cursor-pointer">
        <div className="bg-surface-primary rounded-xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-22 h-22">
          <div className="bg-surface-secondary rounded-md absolute top-3 left-1/2 -translate-x-1/2 w-16 h-7"/>
          <div className="bg-surface-tertiary rounded-md absolute top-12 left-1/2 -translate-x-1/2 w-16 h-7"/>
        </div>
      </div>
    </form>
  );
};

export default AccountPreferences;