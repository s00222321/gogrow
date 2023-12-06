import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBBtn,
} from "mdb-react-ui-kit";

interface Plant {
  plant_id: number;
  name: string;
  latin_name: string;
  description: string;
  growingTime: string;
  plants: string;
  planticons: string;
  growtime: string;
}

const MyGarden: React.FC = () => {
  const [gardenPlants, setGardenPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchPlantsData = async () => {
      const response = await fetch(
        "https://bmhnryodyk.execute-api.eu-west-1.amazonaws.com/v1"
      );
      const jsonResponse = await response.json();
      return JSON.parse(jsonResponse.body);
    };

    const fetchGardenPlants = async () => {
      const response = await fetch(
        "https://kiozllvru1.execute-api.eu-west-1.amazonaws.com/v1/siobhan_donnelly"
      );
      const jsonResponse = await response.json();
      const currentlyGrowing = jsonResponse.data?.currently_growing;

      if (!Array.isArray(currentlyGrowing)) {
        setGardenPlants([]);
        return;
      }

      const plantsData = await fetchPlantsData();

      const gardenPlantsData = currentlyGrowing
        .map((growingPlant) => {
          const plantData = plantsData.find(
            (plant: { plant_id: number }) =>
              plant.plant_id === parseInt(growingPlant.plant_id)
          );
          return plantData
            ? {
                ...plantData,
                growingTime: calculateGrowingTime(growingPlant.date_added),
              }
            : null;
        })
        .filter((plant) => plant !== null);

      setGardenPlants(gardenPlantsData);
    };

    const calculateGrowingTime = (dateAdded: string | number | Date) => {
      const dateAddedTime = new Date(dateAdded);
      const currentTime = new Date();
      const differenceInTime = currentTime.getTime() - dateAddedTime.getTime();
      const differenceInHours = differenceInTime / (1000 * 3600);
      return differenceInHours < 24
        ? `${differenceInHours.toFixed(0)} Hours growing`
        : `${(differenceInHours / 24).toFixed(0)} Days growing`;
    };

    fetchGardenPlants();
  }, []);

  const handleDeleteFromGarden = async (plant_id: number) => {
    const plantToDelete = gardenPlants.find(
      (plant) => plant.plant_id === plant_id
    );
    if (!plantToDelete) {
      toast.error("Plant not found", { position: "bottom-center" });
      return;
    }

    try {
      const response = await fetch(
        "https://ghslhsfcrh.execute-api.eu-west-1.amazonaws.com/v1/currentlygrowing",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "test", plant_id }),
        }
      );

      if (response.ok) {
        setGardenPlants(
          gardenPlants.filter((plant) => plant.plant_id !== plant_id)
        );
        toast.success(`${plantToDelete.name} removed from My Garden`, {
          position: "bottom-center",
        });
      } else {
        toast.error(`Failed to remove ${plantToDelete.name} from garden`, {
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(`An error occurred removing ${plantToDelete.name}`, {
        position: "bottom-center",
      });
    }
  };

  const navigateToPlantsPage = () => {
    window.location.href = "/plants";
  };

  return (
    <MDBContainer
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ paddingTop: "4%", paddingBottom: "10%" }}
    >
      <div className="w-75">
        <div className="text-center mb-4">
          <span className="h4">My Garden</span>
        </div>
        <MDBRow className="g-4">
          {gardenPlants.map((plant) => (
            <MDBCol xl="4" lg="6" key={plant.plant_id}>
              <MDBCard>
                <MDBCardBody>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <img
                        src={plant.planticons}
                        alt={plant.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          marginRight: "15px",
                        }}
                      />
                      <div>
                        <p className="fw-bold mb-1">{plant.name}</p>
                        <p className="text-muted mb-0">{plant.growingTime}</p>
                      </div>
                    </div>
                    <div>
                      <a
                        href={`/plant/${plant.plant_id}`}
                        role="button"
                        style={{ color: "grey", marginRight: "10px" }}
                        title="More information"
                      >
                        <i className="fas fa-info-circle fa-2x"></i>
                      </a>
                      <a
                        role="button"
                        style={{ color: "grey" }}
                        title="Remove from my garden"
                        onClick={() => handleDeleteFromGarden(plant.plant_id)}
                      >
                        <i className="fas fa-trash-alt fa-2x"></i>
                      </a>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
        <div className="mt-4">
          <MDBBtn color="primary" onClick={navigateToPlantsPage}>
            Add more plants
          </MDBBtn>
        </div>
      </div>
    </MDBContainer>
  );
};

export default MyGarden;
