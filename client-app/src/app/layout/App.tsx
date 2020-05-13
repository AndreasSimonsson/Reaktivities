import React, { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import Axios from "axios";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/navBar";
import { ActivityDashboard } from "../../features/activities/dashboard/activityDashboard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const handleSelectedActivity = (id: string) => {
    setEditMode(false);
    setSelectedActivity(activities.filter((act) => act.id === id)[0]);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCrateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleEditActivity = (activity: IActivity) => {
    setActivities([
      ...activities.filter((a) => a.id !== activity.id),
      activity,
    ]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter((a) => a.id !== id)]);
  };

  useEffect(() => {
    Axios.get<IActivity[]>("http://localhost:5000/api/activities").then(
      (result) => {
        let activities: IActivity[] = [];
        result.data.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          activities.push(activity);
        });
        setActivities(activities);
      }
    );
  }, []);

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
        />
      </Container>
    </Fragment>
  );
};

export default App;
