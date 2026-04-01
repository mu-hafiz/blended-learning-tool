import { Button, PageContainer } from "@components";
import { supabase } from "@lib/supabaseClient";
import { useAuth } from "@providers/AuthProvider";
import { toast } from "@lib/toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const increaseFlashcardCount = async () => {
    await supabase.rpc('add_to_user_stat', {
      p_amount: 1,
      p_attr: 'flashcard_sets_completed'
    });
    toast.success('Incremented')
  }

  return (
    <PageContainer title="Dashboard">
      <div className="flex flex-col gap-5">
        <h2>My Courses</h2>
        <Button
          onClick={() => increaseFlashcardCount()}
        >
          Increase Flashcard Count
        </Button>
        <Button
          onClick={() => toast.achievement({
            title: "'Quiz Novice' achievement unlocked!",
            description: 'You gained 500XP',
            navigate: () => navigate("/progression/achievements")
          })}
        >
          Test Achievement Notif
        </Button>
        <Button
          onClick={() => toast.level({
            title: "Level Up",
            description: 'You are now level 2',
            navigate: () => navigate("/progression/level")
          })}
        >
          Test Level Notif
        </Button>
        <Button
          onClick={() => toast.friend({
            title: "Friend Request Received",
            description: 'Someone wants to be your friend!',
            navigate: () => navigate("/friends")
          })}
        >
          Test Friend Notif
        </Button>
        <Button
          onClick={() => toast.like({
            title: "You received a like!",
            description: 'Someone liked your quiz',
            navigate: () => navigate("/")
          })}
        >
          Test Like Notif
        </Button>      
        <Button
          onClick={() => toast.notification('Quiz Novice', 'Test')}
        >
          Test Regular Notif
        </Button>
        <Button
          onClick={() => toast.theme({
            title: "'Berry' theme unlocked!",
            description: `Go check it out at 'account preferences'`,
            navigate: () => navigate("/account/preferences")
          })}
        >
          Test Theme Notif
        </Button>
      </div>
    </PageContainer>
    
  )
}

export default Dashboard;