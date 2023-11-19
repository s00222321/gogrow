import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBCardImage,
} from "mdb-react-ui-kit";

interface UserData {
  ProfilePic: string;
  Username: string;
  email: string;
  DateJoined: string;
  County: string;
  FavoritedPlants: string[];
  SustainabilityScore: number;
  PlantsCurrentlyGrowing: Record<string, string>;
  Achievements: Record<string, { DateEarned: string; Description: string }>;
}

const UserDetails: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const apiUrl =
          "https://kiozllvru1.execute-api.eu-west-1.amazonaws.com/v1/siobhan_donnelly";
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch user profile data");
        }

        const jsonData = await response.json();
        setUserData(jsonData.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const formatAchievementDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <MDBContainer className="py-5">
      {userData ? (
        <MDBCard>
          <MDBCardBody>
            <MDBRow className="align-items-center">
              <MDBCol md="3" className="text-center">
                <MDBCardImage
                  src={userData.ProfilePic}
                  alt="Profile Picture"
                  fluid
                  style={{
                    borderRadius: "50%",
                    maxWidth: "100px",
                    margin: "auto",
                    marginTop: "10px",
                  }}
                />
                <p className="mt-3">
                  <strong>{userData.Username}</strong>
                </p>
              </MDBCol>
              <MDBCol md="9">
                <MDBCardText>
                  <strong>Email:</strong> {userData.email}
                </MDBCardText>
                <MDBCardText>
                  <strong>Date Joined:</strong> {userData.DateJoined}
                </MDBCardText>
                <MDBCardText>
                  <strong>County:</strong> {userData.County}
                </MDBCardText>
                <MDBCardText>
                  <strong>Favorited Plants:</strong>{" "}
                  {userData.FavoritedPlants.join(", ")}
                </MDBCardText>
                <MDBCardText>
                  <strong>Sustainability Score:</strong>{" "}
                  {userData.SustainabilityScore}
                </MDBCardText>
              </MDBCol>
            </MDBRow>
            <hr />
            <MDBRow>
              <MDBCol md="6">
                {userData.PlantsCurrentlyGrowing && (
                  <>
                    <h5>Plants Currently Growing</h5>
                    {Object.entries(userData.PlantsCurrentlyGrowing).map(
                      ([plantName, growthStatus]) => (
                        <p key={plantName}>
                          <strong>{plantName}:</strong> {growthStatus}
                        </p>
                      )
                    )}
                  </>
                )}
              </MDBCol>
              <MDBCol md="6">
                {userData.Achievements && (
                  <>
                    <h5>Achievements</h5>
                    {Object.entries(userData.Achievements).map(
                      ([achievementName, achievementDetails]) => (
                        <div key={achievementName}>
                          <p>
                            <strong>{achievementName}:</strong>{" "}
                            Date Earned:{" "}
                            {formatAchievementDate(
                              achievementDetails.DateEarned
                            )}
                          </p>
                          <p>Description: {achievementDetails.Description}</p>
                        </div>
                      )
                    )}
                  </>
                )}
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      ) : (
        <p>Loading...</p>
      )}
    </MDBContainer>
  );
};

export default UserDetails;
