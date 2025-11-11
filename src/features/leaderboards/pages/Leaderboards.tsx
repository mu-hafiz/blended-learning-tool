import { Button, PageContainer } from "@components";

const Leaderboards = () => {
  return (
    <PageContainer title="Leaderboards">
      <div className="basic-container">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Button>Course Select</Button>
            <Button>Stat Select</Button>
          </div>
          <Button>Friends</Button>
        </div>
        <hr/>
        <ul>
          
        </ul>
      </div>
    </PageContainer>
  )
};

export default Leaderboards;