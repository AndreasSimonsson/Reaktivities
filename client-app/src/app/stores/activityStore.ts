import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable activityRegistry = new Map();
  @observable target = "";

  @computed get activitiesByDate() {
    const activitiesGrouped = this.groupActivitiesByDate(Array.from(this.activityRegistry.values())); 
    // console.log(activitiesGrouped);
    return activitiesGrouped;
  }

  groupActivitiesByDate(activities:IActivity[]) {
    const sortedActivities = activities.sort((a, b) => a.date.getTime() - b.date.getTime());

    return Object.entries(sortedActivities.reduce((activities, activity)=>{
      const date = activity.date.toISOString().split("T")[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    },{} as {[key:string]: IActivity[]}));
  }

  @action loadActivities = async () => {
    try {
      this.loadingInitial = true;
      const activities = await agent.Activities.list();

      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
      
    } catch (error) {
      runInAction("loading activities error", () => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  //Either from Map array or the API
  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
      return activity;
    } 
    else {
      try {
        this.loadingInitial = true;
        activity = await agent.Activities.details(id);

        runInAction("getting activity", () => {
            activity.date = new Date(activity.date);
            this.activity = activity;
            this.activityRegistry.set(activity.id, activity);
            this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("get activity error", () => {
          this.loadingInitial = false;
          console.log(error);
        });                
      }
    }
  };

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    try {
      this.submitting = true;
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      console.log(error.response);
      toast.error("Problem with submitting data");
    }
  };

  @action editActivity = async (activity: IActivity) => {
    try {
      this.submitting = true;
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
         this.submitting = false;
      });
      console.log(error.response);
      toast.error("Problem with submitting data");
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    try {
      this.submitting = true;
      this.target = event.currentTarget.name;
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.activity = null;
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
        console.log(error);
      });
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }
}

export default createContext(new ActivityStore());
