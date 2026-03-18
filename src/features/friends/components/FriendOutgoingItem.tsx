import { Button } from "@components";

type FriendOutgoingProps = {
  username: string;
  cancel: () => void;
}

const FriendOutgoingItem = ({ username, cancel }: FriendOutgoingProps) => {
  return (
    <div className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <div className="bg-black rounded-full h-10 w-10"/>
        <p>{username}</p>
      </div>
      <Button
        variant="danger"
        onClick={cancel}
      >
        Cancel
      </Button>
    </div>
  );
};

export default FriendOutgoingItem;