import React, { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit';

interface LeaderboardData {
  Username: string;
  SustainabilityScore: number;
  ProfilePic: string;
}

const API_URL = "https://0fykzk1eg7.execute-api.eu-west-1.amazonaws.com/v1/leaderboard"

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const parsedData = JSON.parse(data.body);
        const leaderboardData = parsedData.data;

        setLeaderboardData(leaderboardData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="d-flex flex-column align-items-center" style={{ marginTop: '20px' }}>
      {leaderboardData && (
        <MDBCard className="mb-3" style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <MDBCardBody>
            <MDBCardTitle className="text-center mb-3">Leaderboard 🏆</MDBCardTitle>
            {leaderboardData.map((user, index) => (
              <div key={index} className="d-flex justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <img
                    src={user.ProfilePic}
                    alt={`Profile ${user.Username}`}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                  />
                  <div>{user.Username}</div>
                </div>
                <div>{user.SustainabilityScore}</div>
              </div>
            ))}
          </MDBCardBody>
        </MDBCard>
      )}
    </div>
  );
};

export default Leaderboard;
