import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import { IProfile, IPhoto } from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  // Loading indicator for setting main photo
  @observable loading = false;
  @observable updatingProfile = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else return false;
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });

      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);

      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading photo");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.image = photo.url;
        this.profile!.photos.find((x) => x.isMain === true)!.isMain = false;
        this.profile!.photos.find((x) => x.id === photo.id)!.isMain = true;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problems setting photo to main");
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await agent.Profiles.deletePhoto(photo.id);

      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          (x) => x.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problems setting photo deleting the photo");
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action updateProfile = async (profile: Partial<IProfile>) => {
    this.updatingProfile = true;

    try {
      await agent.Profiles.update(profile);

      runInAction(() => {
       if(this.rootStore.userStore.user!.displayName !== profile.displayName){
        this.rootStore.userStore.user!.displayName = profile.displayName!;

        this.profile = {...this.profile!, ...profile}
       }
        
        this.updatingProfile = false;
      });
    } catch (error) {
      toast.error("Problems updating the");
      console.log(error);
      runInAction(() => {
        this.updatingProfile = false;
      });
    }
  };
}
