import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import { LoadingComponent } from "../../../app/layout/loadingComponent";
import ActivityDetailsHeader from "./activityDetailsHeader";
import ActivityDetailedInfo from "./activityDetailedInfo";
import ActivityDetailedChat from "./activityDetailedChat";
import ActivityDetailedSidebar from "./activityDetailedSidebar";

interface IParamDetails {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<IParamDetails>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const { activity, loadActivity, loadingInitial } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingInitial || !activity)
    return <LoadingComponent>Loading activity ...</LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={activity}/>
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
