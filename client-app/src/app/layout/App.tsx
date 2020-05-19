import React, {  useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/navBar";
import ActivityDashboard from "../../features/activities/dashboard/activityDashboard";
import { LoadingComponent } from "./loadingComponent";
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";

const App = () => {

  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content="Loading content ..." />

  return (
    < >
        <Fragment>
        <NavBar />
        <Container style={{ marginTop: "7em" }}>
          <ActivityDashboard />
        </Container>
      </Fragment>
    </>
  );
};

export default observer(App);
