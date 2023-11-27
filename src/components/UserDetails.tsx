import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBCardImage,
  MDBCardText,
  MDBBtn,
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
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingCounty, setIsEditingCounty] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newCounty, setNewCounty] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

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

        // Log user data
        console.log("Fetched user data:", jsonData.data);
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

  const handleEditSaveEmail = async () => {
    console.log("Editing email...");

    try {
        const apiUrl =
            "https://kiozllvru1.execute-api.eu-west-1.amazonaws.com/v1/siobhan_donnelly";
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: newEmail }),
        });

        console.log("Response:", response);

        if (!response.ok) {
            throw new Error("Failed to update email");
        }

        // Show success message
        setUpdateSuccess(true);
        setIsEditingEmail(false); // Exit edit mode

        // Log the current state before the update
        console.log("Before state update:", userData);

        // Synchronously update the state using the functional form
        setUserData((prevUserData) => {
            if (!prevUserData) return null;

            const {
                email,
                ProfilePic,
                Username,
                DateJoined,
                County,
                FavoritedPlants,
                SustainabilityScore,
                PlantsCurrentlyGrowing,
                Achievements,
            } = prevUserData;

            console.log("prevUserData.email:", prevUserData.email);
            console.log("newEmail:", newEmail);

            return {
                email: newEmail,
                ProfilePic: ProfilePic || "",
                Username: Username || "",
                DateJoined: DateJoined || "",
                County: County || "",
                FavoritedPlants: FavoritedPlants || [],
                SustainabilityScore: SustainabilityScore || 0,
                PlantsCurrentlyGrowing: PlantsCurrentlyGrowing || {},
                Achievements: Achievements || {},
            };
        });

        // Log the current state after the update
        console.log("After state update:", userData);

        // Reset new email
        setNewEmail("");

        console.log("Update successful");
    } catch (error) {
        console.error("Error updating email:", error);
    } finally {
        // Always exit edit mode
        setIsEditingEmail(false);
    }
};

  
  const handleEditSaveCounty = async () => {
    console.log("Editing County...");
    try {
      const apiUrl =
        "https://kiozllvru1.execute-api.eu-west-1.amazonaws.com/v1/siobhan_donnelly";
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          County: newCounty, // Include County in the payload
        }),
      });
  
      console.log("Response:", response);
  
      if (!response.ok) {
        throw new Error("Failed to update County");
      }
  
      // Show success message
      setUpdateSuccess(true);
      setIsEditingCounty(false); // Exit edit mode
  
      // Synchronously update the state
      setUserData((prevUserData) =>
        prevUserData
          ? {
              ...prevUserData,
              County: newCounty,
            }
          : null
      );
  
      // Reset new County
      setNewCounty("");
  
      console.log("Update successful");
    } catch (error) {
      console.error("Error updating County:", error);
    } finally {
      // Always exit edit mode
      setIsEditingCounty(false);
    };
  };
  

  console.log("userData.email:", userData?.email);
  console.log("userData.County:", userData?.County);

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
                  <strong>Email:</strong>{" "}
                  {isEditingEmail ? (
                    <>
                      <input
                        type="text"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                      <MDBBtn
                        color="success"
                        size="sm"
                        onClick={handleEditSaveEmail}
                        style={{ marginLeft: "5px" }}
                      >
                        Save
                      </MDBBtn>
                    </>
                  ) : (
                    <>
                      {userData.email}
                      <MDBBtn
                        color="primary"
                        outline
                        size="sm"
                        onClick={() => setIsEditingEmail(true)}
                        style={{ marginLeft: "5px" }}
                      >
                        Edit
                      </MDBBtn>
                    </>
                  )}
                </MDBCardText>
                <MDBCardText>
                  <strong>Date Joined:</strong> {userData.DateJoined}
                </MDBCardText>
                <MDBCardText>
                  <strong>County:</strong>{" "}
                  {isEditingCounty ? (
                    <>
                      <input
                        type="text"
                        value={newCounty}
                        onChange={(e) => setNewCounty(e.target.value)}
                      />
                      <MDBBtn
                        color="success"
                        size="sm"
                        onClick={handleEditSaveCounty}
                        style={{ marginLeft: "5px" }}
                      >
                        Save
                      </MDBBtn>
                    </>
                  ) : (
                    <>
                      {userData.County}
                      <MDBBtn
                        color="primary"
                        outline
                        size="sm"
                        onClick={() => setIsEditingCounty(true)}
                        style={{ marginLeft: "5px" }}
                      >
                        Edit
                      </MDBBtn>
                    </>
                  )}
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
                            <strong>{achievementName}:</strong> Date Earned:{" "}
                            {formatAchievementDate(
                              achievementDetails.DateEarned
                            )}
                          </p>
                          <p>
                            Description: {achievementDetails.Description}
                          </p>
                        </div>
                      )
                    )}
                  </>
                )}
              </MDBCol>
            </MDBRow>
            {updateSuccess && (
              <p className="text-success">Update successful!</p>
            )}
          </MDBCardBody>
        </MDBCard>
      ) : (
        <p>Loading...</p>
      )}
    </MDBContainer>
  );
};

export default UserDetails;
