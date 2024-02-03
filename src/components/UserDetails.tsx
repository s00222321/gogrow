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
  MDBCardTitle,
  MDBCardSubTitle,
} from "mdb-react-ui-kit";

interface UserData {
  ProfilePic: string;
  Username: string;
  email: string;
  DateJoined: string;
  County: string;
  SustainabilityScore: number;
  Achievements: Record<string, { DateEarned: string; Description: string }>;
}

const counties = [
  "Antrim",
  "Armagh",
  "Carlow",
  "Cavan",
  "Clare",
  "Cork",
  "Derry",
  "Donegal",
  "Down",
  "Dublin",
  "Fermanagh",
  "Galway",
  "Kerry",
  "Kildare",
  "Kilkenny",
  "Laois",
  "Leitrim",
  "Limerick",
  "Longford",
  "Louth",
  "Mayo",
  "Meath",
  "Monaghan",
  "Offaly",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Tyrone",
  "Waterford",
  "Westmeath",
  "Wexford",
  "Wicklow",
];

const UserDetails: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newCounty, setNewCounty] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const apiUrl =
          "https://0fykzk1eg7.execute-api.eu-west-1.amazonaws.com/v1/users/siobhan_donnelly";
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

  const handleEditSave = async () => {
    console.log("Saving changes...");

    try {
      const apiUrl =
        "https://0fykzk1eg7.execute-api.eu-west-1.amazonaws.com/v1/users/siobhan_donnelly";
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail,
          County: newCounty,
        }),
      });

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      // Fetch updated user data after a successful update
      const updatedUserData = await fetch(apiUrl).then((res) => res.json());

      console.log("Updated User Data:", updatedUserData);

      // Show success message
      setUpdateSuccess(true);
      setIsEditing(false); // Exit edit mode

      // Update state with the new data
      setUserData(updatedUserData.data);

      // Log current state after update
      console.log("After state update:", userData);

      // Reset new values
      setNewEmail("");
      setNewCounty("");

      console.log("Update successful");
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      // Always exit edit mode
      setIsEditing(false);
    }
  };

  const enterEditMode = () => {
    setIsEditing(true);
    // Prefill the email and county fields with existing data
    setNewEmail(userData?.email || "");
    setNewCounty(userData?.County || "");
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
                <MDBCardText className="mb-2" style={{ width: "100%" }}>
                  <strong>Email:</strong>{" "}
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="form-control"
                      />
                    </>
                  ) : (
                    <>
                      {userData.email}
                    </>
                  )}
                  {isEditing && (
                    <MDBBtn
                      color="success"
                      size="sm"
                      onClick={handleEditSave}
                      className="mx-2 mt-2"
                    >
                      Save
                    </MDBBtn>
                  )}
                  <MDBBtn
                    color="primary"
                    size="sm"
                    onClick={isEditing ? () => setIsEditing(false) : enterEditMode}
                    className="mx-2 mt-2"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </MDBBtn>
                </MDBCardText>
                <MDBCardText className="mb-2">
                  <strong>County:</strong>{" "}
                  {isEditing ? (
                    <>
                      <select
                        value={newCounty}
                        onChange={(e) => setNewCounty(e.target.value)}
                        className="form-select"
                        style={{ width: "40%" }}
                      >
                        <option value="" disabled>
                          Select County
                        </option>
                        {counties.map((county) => (
                          <option key={county} value={county}>
                            {county}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      {userData.County}
                    </>
                  )}
                </MDBCardText>
                <MDBCardText className="mb-2">
                <strong>Date Joined:</strong>{" "}
                {userData.DateJoined &&
                  new Date(userData.DateJoined).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
              </MDBCardText>
                <MDBCardText className="mb-2">
                  <strong>Sustainability Score:</strong>{" "}
                  {userData.SustainabilityScore}
                </MDBCardText>
              </MDBCol>
            </MDBRow>
            <hr />
            {updateSuccess && (
              <p className="text-success">Update successful!</p>
            )}
            <MDBRow>
              <MDBCol md="12">
                {userData.Achievements && (
                  <>
                    <h5>Achievements</h5>
                    {Object.entries(userData.Achievements).map(
                      ([achievementName, achievementDetails]) => (
                        <MDBCard key={achievementName} className="mb-3">
                          <MDBCardBody>
                            <MDBCardTitle>{achievementName}</MDBCardTitle>
                            <MDBCardSubTitle>
                              Date Earned:{" "}
                              {formatAchievementDate(
                                achievementDetails.DateEarned
                              )}
                            </MDBCardSubTitle>
                            <MDBCardText>
                              Description: {achievementDetails.Description}
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
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
