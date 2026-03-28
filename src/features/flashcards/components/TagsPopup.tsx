import { Button, TextInput } from "@components";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const TagsPopup = ({ setSearchTags }: { setSearchTags: (tags: string[]) => void; }) => {
  const [tag, setTag] = useState("");
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  const handleAdd = () => {
    if (!tag) return;
    if (currentTags.includes(tag)) {
      setTag("");
      return;
    }
    setCurrentTags(prev => {
      const updated = [...prev, tag.replace(",", "")];
      setSearchTags(updated);
      return updated;
    });
    setTag("");
  }

  const handleRemove = (tag: string) => {
    setCurrentTags(prev => {
      const updated = prev.filter(t => t !== tag);
      setSearchTags(updated);
      return updated;
    });
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