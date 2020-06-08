import React, { useContext, useState } from "react";
import {
  Tab,
  Header,
  Container,
  Icon,
  Grid,
  Button,
  GridColumn,
  Input,
  TextArea,
} from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import ProfileEditForm from "./ProfileEditForm";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, updateProfile } = rootStore.profileStore;

  const [isEditing, setIsEditing] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column width={13}>
            <Container text>
              <Header as="h2">
                <Icon name="user" size="mini" />
                About {profile?.displayName}
              </Header>
            </Container>
          </Grid.Column>
          <Grid.Column width={3}>
            <Button
              content={isEditing ? "Cancel" : "Edit profile"}
              disabled={!isCurrentUser}
              onClick={() => setIsEditing(!isEditing)}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            {isEditing ? (
              <ProfileEditForm
                updateProfile={updateProfile}
                profile={profile!}
              />
            ) : (
              <span>{profile?.bio}</span>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
