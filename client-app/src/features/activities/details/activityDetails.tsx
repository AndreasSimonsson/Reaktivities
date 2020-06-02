import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import { LoadingComponent } from "../../../app/layout/loadingComponent";
import ActivityDetailsHeader from "./activityDetailsHeader";
import ActivityDetailedInfo from "./activityDetailedInfo";
import ActivityDetailedChat from "./activityDetailedChat";
import ActivityDetailedSidebar from "./activityDetailedSidebar";
import { RootStoreContext } from "../../../app/stores/rootStore";

interface IParamDetails {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<IParamDetails>> = ({
  match,
}) => {
  const rootStore = useContext(RootStoreContext);
  const { activity, loadActivity, loadingInitial } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingInitial)
    return <LoadingComponent>Loading activity ...</LoadingComponent>;

  if (!activity) return <h1>Activity not found!</h1>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={activity} />
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
