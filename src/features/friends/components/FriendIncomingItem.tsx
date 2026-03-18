import { Button } from "@components";

type FriendIncomingProps = {
  username: string;
  accept: () => void;
  ignore: () => void;
}

const FriendIncomingItem = ({ username, accept, ignore }: FriendIncomingProps) => {
  return (
    <div className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <div className="bg-black rounded-full h-10 w-10"/>
        <p>{username}</p>
      </div>
      <div className="flex flex-row gap-2">
        <Button
          variant="success"
          onClick={accept}
        >
          Accept
        </Button>
        <Button
          variant="danger"
          onClick={ignore}
        >
          Ignore
        </Button>
      </div>
    </div>
  );
};

export default FriendIncomingItem;