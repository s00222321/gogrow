import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBContainer,
} from "mdb-react-ui-kit";

interface Plant {
  plant_id: number;
  name: string;
  latin_name: string;
  description: string;
  season: string;
  plants: string;
  planticons: string;
  growtime: string;
}

interface CurrentlyGrowingPlant {
  plant_id: string;
  date_added: string;
}

const Plants: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentlyGrowing, setCurrentlyGrowing] = useState<
    CurrentlyGrowingPlant[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchPlants = async () => {
      const response = await fetch(
        "https://bmhnryodyk.execute-api.eu-west-1.amazonaws.com/v1"
      );
      const responseData = await response.json();
      const data = JSON.parse(responseData.body);
      if (Array.isArray(data)) {
        setPlants(data);
      }
    };

    const fetchCurrentlyGrowing = async () => {
      const response = await fetch(
        "https://kiozllvru1.execute-api.eu-west-1.amazonaws.com/v1/siobhan_donnelly"
      );
      const userData = await response.json();
      if (
        userData &&
        userData.data &&
        Array.isArray(userData.data.currently_growing)
      ) {
        setCurrentlyGrowing(userData.data.currently_growing);
      } else {
        setCurrentlyGrowing([]);
      }
    };

    fetchPlants();
    fetchCurrentlyGrowing();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToCurrentlyGrowing = async (plant_id: number) => {
    const response = await fetch(
      "https://ghslhsfcrh.execute-api.eu-west-1.amazonaws.com/v1/currentlygrowing",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "siobhan_donnelly", plant_id }),
      }
    );

    if (response.ok) {
      setCurrentlyGrowing((prev) => [
        ...prev,
        { plant_id: plant_id.toString(), date_added: new Date().toISOString() },
      ]);
      const plant = plants.find((p) => p.plant_id === plant_id);
      toast.success(`Added ${plant?.name} to My Garden`, {
        position: "bottom-center",
      });
    } else {
      toast.error("Failed to add plant to garden", {
        position: "bottom-center",
      });
    }
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MDBContainer
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ paddingTop: "4%", paddingBottom: "10%" }}
    >
      <div className="w-75">
        <div className="text-center mb-4">
          <span className="h4">Plants</span>
        </div>
        <div className="mb-4">
          <input
            className="form-control"
            type="text"
            id="search"
            name="search"
            placeholder="Search for plants"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <MDBRow className="g-4">
          {filteredPlants.map((plant) => (
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
                        <p className="text-muted mb-0">{plant.season}</p>
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
                      {currentlyGrowing &&
                      currentlyGrowing.some(
                        (growing) =>
                          growing.plant_id === plant.plant_id.toString()
                      ) ? (
                        <i
                          className="fas fa-check fa-2x"
                          style={{ color: "grey" }}
                          title="Already in my garden"
                        ></i>
                      ) : (
                        <a
                          href="#!"
                          role="button"
                          style={{ color: "grey" }}
                          title="Add to my garden"
                          onClick={() =>
                            handleAddToCurrentlyGrowing(plant.plant_id)
                          }
                        >
                          <i className="fas fa-plus fa-2x"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      </div>
    </MDBContainer>
  );
};

export default Plants;
