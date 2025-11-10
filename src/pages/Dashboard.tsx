import { Button } from "@components";
import { supabase } from "@lib/supabaseClient";
import { useAuth } from "@providers/AuthProvider";
import { toast } from "@lib/toast";

const Dashboard = () => {
  const { user } = useAuth();

  const increaseQuizCount = async () => {
    await supabase.rpc('add_to_user_stat', {
      p_amount: 1,
      p_attr: 'quizzes_completed'
    });

    const achievementResult = await supabase.functions.invoke('check-achievements', {
      body: { user_id: user!.id, type: 'quizzes_completed' }
    });

    if (!achievementResult.response?.ok) {
      console.log(achievementResult.error);
      toast.error(achievementResult.error);
      return;
    } else {
      toast.success('Incremented')
    }
  }

  const increaseFlashcardCount = async () => {
    await supabase.rpc('add_to_user_stat', {
      p_amount: 1,
      p_attr: 'flashcards_completed'
    });

    const achievementResult = await supabase.functions.invoke('check-achievements', {
      body: { user_id: user!.id, type: 'flashcards_completed' }
    });

    if (!achievementResult.response?.ok) {
      console.log(achievementResult.error);
      toast.error(achievementResult.error);
      return;
    } else {
      toast.success('Incremented')
    }
  }

  return (
    <div>
      <p className="mb-5">Dashboard</p>
      <Button
        onClick={() => increaseQuizCount()}
      >
        Increase Quiz Count
      </Button>
      <Button
        onClick={() => increaseFlashcardCount()}
      >
        Increase Flashcard Count
      </Button>
      <Button
        onClick={() => toast.achievement('Quiz Novice', 'Test')}
      >
        Test Achievement Notif
      </Button>
      <Button
        onClick={() => toast.notification('Quiz Novice', 'Test')}
      >
        Test Regular Notif
      </Button>
    </div>
  )
}

export default Dashboard;