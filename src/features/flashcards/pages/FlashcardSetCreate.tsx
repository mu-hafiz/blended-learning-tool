import { Button, PageContainer, RHFTextInput, Tooltip } from "@components";
import { Link, useParams } from "react-router-dom";
import { flashcardSetSchema, type FlashcardSetValues } from "../types/formSchemas";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlus } from "react-icons/fa";
import FlashcardCreateItem from "../components/FlashcardCreateItem";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import TagsPopup from "../components/TagsPopup";
import { PopupContainer } from "@components";
import { useEffect, useState } from "react";
import { supabase } from "@lib/supabaseClient";
import { toast } from "@lib/toast";
import { useAuth } from "@providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import FlashcardSetDB from "@lib/db/flashcardSets";
import { tryCatch } from "@utils/tryCatch";
import { useLoading } from "@providers/LoadingProvider";
import NotFound from "@pages/NotFound";
import { FaArrowLeftLong } from "react-icons/fa6";

const FlashcardSetCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { flashcardSetId } = useParams();
  const { control, handleSubmit, setValue, watch, formState: { isSubmitting, errors }, reset } = useForm<FlashcardSetValues>({
    resolver: zodResolver(flashcardSetSchema),
    defaultValues: {
      title: "",
      description: "",
      private: false,
      flashcards: [
        { front: "", back: "" }
      ],
      tags: []
    }
  });
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "flashcards"
  });

  const [showTagsPopup, setShowTagsPopup] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [originalFlashcardTitle, setOriginalFlashcardTitle] = useState("");
  const [creatorId, setCreatorId] = useState("");

  const isEditing = !!flashcardSetId;
  const notPermitted = user && creatorId && user.id !== creatorId;
  const isPrivate = watch("private");
  const tags = watch("tags");

  if (notFound || notPermitted) {
    return (
      <NotFound
        title="Were you snooping around? 🤔"
        description="Something seems to have gone wrong"
      />
    );
  }

  useEffect(() => {
    if (!isEditing) return;

    const fetchFlashcardSet = async () => {
      showLoading("Fetching flashcard set information...");
      const { data, error } = await tryCatch(FlashcardSetDB.getFlashcardSetWithFlashcards(flashcardSetId));
      if (error) {
        toast.error("Could not fetch flashcard information, please try again later");
        setNotFound(true);
        hideLoading();
        return;
      }
      reset({
        title: data.title,
        description: data.description,
        private: data.private,
        tags: data.tags,
        flashcards: data.flashcards.map(f => ({
          front: f.front,
          back: f.back
        }))
      });
      setCreatorId(data.creator_id);
      setOriginalFlashcardTitle(data.title);
      hideLoading();
    };

    fetchFlashcardSet();

    return () => hideLoading();
  }, []);

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleReorder = (index: number, up: boolean) => {
    const newIndex = up ? index - 1 : index + 1;
    move(index, newIndex);
  };

  const handleAdd = () => {
    append({ front: "", back: "" });
  };

  const handleSubmitSet = async (data: FlashcardSetValues) => {
    if (!user) {
      toast.error("Could not get your user information, please try again later");
      return;
    }

    const toastId = toast.loading(isEditing ? "Updating..." : "Creating...");
    let newFlashcardSetId: string | null;
    let error;

    if (isEditing) {
      const updateResult = await supabase.rpc("update_flashcard_set", {
        p_flashcard_set_id: flashcardSetId,
        p_user_id: user.id,
        p_title: data.title,
        p_description: data.description ?? "",
        p_private: data.private,
        p_flashcards: data.flashcards,
        p_tags: data.tags
      });
      newFlashcardSetId = updateResult.data;
      error = updateResult.error;
    } else {
      const createResult = await supabase.rpc("create_flashcard_set", {
        p_user_id: user.id,
        p_title: data.title,
        p_description: data.description ?? "",
        p_private: data.private,
        p_flashcards: data.flashcards,
        p_tags: data.tags
      });
      newFlashcardSetId = createResult.data;
      error = createResult.error;
    }

    if (error) {
      toast.error(`Could not ${isEditing ? "update" : "create"} flashcard set, please try again later`, { id: toastId });
      console.log(error);
      return;
    }

    toast.success(`Flashcard set ${isEditing ? "updated" : "created"}!`, { id: toastId });
    navigate(`/flashcards/${newFlashcardSetId}`);
  };

  return (
    <>
      <PageContainer>
        <div className="flex flex-row items-center gap-3 md:gap-4 mb-2">
          <Tooltip
            position="bottom"
            text="Back to flashcards"
          >
            <Link to="/flashcards">
              <FaArrowLeftLong
                className="cursor-pointer transition-transform duration-250 hover:-translate-x-1 size-8 md:size-12"
              />
            </Link>
          </Tooltip>
          <h1 className="text-left">{`${isEditing ? "Update" : "Create"} Flashcard Set`}</h1>
        </div>
        {isEditing && <h2 className="mb-5">Editing: {originalFlashcardTitle}</h2>}
        <form onSubmit={handleSubmit(handleSubmitSet)}>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <RHFTextInput
                name="title"
                control={control}
                placeholder="My Cool Flashcard Set"
                title="Title"
                containerClassName="col-span-2"
              />
              <RHFTextInput
                name="description"
                control={control}
                placeholder="This is about my cool flashcard set..."
                title="Description"
                multiline
                required={false}
                containerClassName="col-span-2"
              />
              <div className="flex flex-col items-center justify-center lg:col-span-2">
                <h2>Visibility</h2>
                <p className="subtitle text-center mb-2">Contribute to the community! (pretty please 🥹)</p>
                <Button
                  variant={!isPrivate ? "success" : "danger"}
                  className="gap-2 w-fit"
                  onClick={() => setValue("private", !isPrivate)}
                >
                  {!isPrivate ? "Public" : "Private"}
                  {!isPrivate ? <FaEye className="size-4 sm:size-5" /> : <FaEyeSlash className="size-4 sm:size-5" />}
                </Button>
              </div>
              <div className="flex flex-col items-center justify-center lg:col-span-2">
                <h2>Tags</h2>
                <p className="subtitle text-center mb-2">Choose tags that help others discover your set (max 5)</p>
                <Button
                  className="gap-2 w-fit"
                  onClick={() => setShowTagsPopup(true)}
                >
                  Select Tags{tags.length > 0 && ` (${tags.length})`}
                </Button>
                {errors.tags && (
                  <p className="text-error-text">Cannot have more than 5 tags!</p>
                )}
              </div>
            </div>
            {fields.map((field, index) => (
              <FlashcardCreateItem
                index={index}
                control={control}
                handleRemove={() => handleRemove(index)}
                handleReorder={({ up }: {up: boolean}) => handleReorder(index, up)}
                totalFlashcards={fields.length}
                key={field.id}
              />
            ))}
              <Button
                type="button"
                variant="success"
                className="w-fit self-center gap-2"
                disabled={isSubmitting}
                onClick={handleAdd}
              >
                Add Flashcard
                <FaPlus />
              </Button>
              <Button
                type="submit"
                className="w-fit self-center"
                loading={isSubmitting}
              >
                {isEditing ? "Update" : "Create"} Set!
              </Button>
          </div>
        </form>
      </PageContainer>
      <PopupContainer
        open={showTagsPopup}
        onClose={() => setShowTagsPopup(false)}
        sizeClassName="h-fit sm:h-fit"
      >
        <TagsPopup
          setTags={(newTags: string[]) => setValue("tags", newTags)}
          currentTags={tags}
        />
      </PopupContainer>
    </>
  );
};

export default FlashcardSetCreate;