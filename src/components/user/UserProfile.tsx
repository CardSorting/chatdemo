import React from "react";
import { useParams } from "react-router-dom";
import ProfileContainer from "./profile/ProfileContainer";

const UserProfile = () => {
  const { userId } = useParams();

  if (!userId) {
    return null;
  }

  return <ProfileContainer />;
};

export default UserProfile;
