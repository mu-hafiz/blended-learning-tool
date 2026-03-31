import { Button, TextInput } from "@components";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

type TagsPopupProps = {
  setTags: (tags: string[]) => void;
  currentTags: string[];
}

const TagsPopup = ({ setTags, currentTags }: TagsPopupProps) => {
  const [tag, setTag] = useState("");

  const handleAdd = () => {
    if (!tag) return;
    if (currentTags.includes(tag)) {
      setTag("");
      return;
    }
    const cleaned = tag.replace(/[,#]/g, "").replace(" ", "_").toLowerCase();
    if (!cleaned) return;
    setTags([...currentTags, cleaned]);
    setTag("");
  }

  const handleRemove = (tag: string) => {
    setTags(currentTags.filter(t => t !== tag));
  }

  return (
    <form
      className="w-100 h-50 flex flex-col"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAdd();
        }
      }}
    >
      <h2 className="text-center mb-4">Select Tags</h2>
      <div className="flex items-center gap-4">
        <TextInput
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <Button
          onClick={handleAdd}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-1 overflow-y-auto mt-5">
        {currentTags.map(tag => (
          <div
            className="bg-surface-tertiary px-2 py-1 rounded-full flex gap-1 items-center cursor-pointer"
            onClick={() => handleRemove(tag)}
            key={tag}
          >
            <p>#{tag}</p>
            <RxCross2 size={15} />
          </div>
        ))}
      </div>
    </form>
  );
}

export default TagsPopup;