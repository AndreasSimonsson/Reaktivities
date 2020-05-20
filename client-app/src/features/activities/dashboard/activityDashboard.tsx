import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./activityList";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from "../../../app/layout/loadingComponent";
import ActivityStore from "../../../app/stores/activityStore";

const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading content ..." />;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <h1>Activity filters</h1>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
