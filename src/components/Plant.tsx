import React, { useEffect, useState } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBCardImage,
} from 'mdb-react-ui-kit';
import { useParams } from 'react-router-dom';

interface PlantData {
  plant_id: string;
  name: string;
  latin_name: string;
  description: string;
  season: string;
  plants: string; // URL to the plant image
  planticons: string; // URL to the plant icon
  growtime: string;
}

const Plant: React.FC = () => {
  const { plant_id } = useParams<{ plant_id: string }>();
  const [plant, setPlant] = useState<PlantData | null>(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await fetch(
          `https://bmhnryodyk.execute-api.eu-west-1.amazonaws.com/v1/${plant_id}`
        );
        const responseData = await response.json();
        const data = JSON.parse(responseData.body);
        setPlant(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlant();
  }, [plant_id]);

  return (
    <MDBContainer className="py-5">
      {plant ? (
        <MDBCard>
          <MDBRow className="g-0">
            <MDBCol
              md="4"
              className="overflow-hidden"
              style={{ borderRadius: '0.5rem' }}
            >
              <MDBCardImage src={plant.plants} alt={plant.name} fluid />
            </MDBCol>
            <MDBCol md="8">
              <MDBCardBody>
                <MDBCardTitle>{plant.name}</MDBCardTitle>
                <MDBCardText>
                  <strong>Latin Name:</strong> {plant.latin_name}
                </MDBCardText>
                <MDBCardText>{plant.description}</MDBCardText>
                <MDBCardText>
                  <strong>Season:</strong> {plant.season}
                </MDBCardText>
                <MDBCardText>
                  <strong>Growth Time:</strong> {plant.growtime}
                </MDBCardText>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      ) : (
        <p>Loading...</p>
      )}
    </MDBContainer>
  );
};

export default Plant;
