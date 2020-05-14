import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/navBar";
import { ActivityDashboard } from "../../features/activities/dashboard/activityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./loadingComponent";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState("");

  const handleSelectedActivity = (id: string) => {
    setEditMode(false);
    setSelectedActivity(activities.filter((act) => act.id === id)[0]);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCrateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then( () => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(()=>setSubmitting(false))
    
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(()=>{
      setActivities([
        ...activities.filter((a) => a.id !== activity.id),
        activity,
      ]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(()=>setSubmitting(false))
  };

  const handleDeleteActivity = (event:SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter((a) => a.id !== id)]);
    }).then(()=>setSubmitting(false))
  };

  useEffect(() => {
    agent.Activities.list()
    .then(
      (result) => {
        let activities: IActivity[] = [];
        result.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          activities.push(activity);
        });
        setActivities(activities);
      }
    ).then(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent content="Loading content ..." />

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />

      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectedActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCrateActivity}
          editActivity={handleEditActivity}
          handleDeleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
