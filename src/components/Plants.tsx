import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBContainer,
} from "mdb-react-ui-kit";
import { useAuth } from "./AuthContext";
import { PLANT_API, USER_API, MYGARDEN_API } from '../apis';

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
  plant_id: number;
  date_added: string;
}

const Plants: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentlyGrowing, setCurrentlyGrowing] = useState<CurrentlyGrowingPlant[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  const { loginData } = useAuth();
  const username = loginData?.username || '';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setItemsPerPage(9);
      } else {
        setItemsPerPage(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const fetchPlants = async () => {
      try {
        const response = await fetch(PLANT_API);
        const responseData = await response.json();
        const data = JSON.parse(responseData.body);
        if (Array.isArray(data)) {
          setPlants(data);
        }
      } catch (error) {
        console.error("Error fetching plants data:", error);
      }
    };

    const fetchCurrentlyGrowing = async () => {
      try {
        const response = await fetch(
          `${USER_API}/users/${username}`
        );
        const userData = await response.json();
        const userCurrentlyGrowing = userData.data?.currently_growing || [];

        setCurrentlyGrowing(
          userCurrentlyGrowing.map((item: { plant_id: string }) => ({
            ...item,
            plant_id: parseInt(item.plant_id),
          }))
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchPlants();
    fetchCurrentlyGrowing();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [username]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleAddToCurrentlyGrowing = async (plant_id: number) => {
    try {
      const response = await fetch(
        `${MYGARDEN_API}/currentlygrowing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, plant_id }),
        }
      );

      if (response.ok) {
        setCurrentlyGrowing((prev) => [
          ...prev,
          { plant_id, date_added: new Date().toISOString() },
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
    } catch (error) {
      console.error("Error adding plant to garden:", error);
    }
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlants = filteredPlants.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <MDBContainer
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ paddingTop: "4%", paddingBottom: "10%" }}
    >
      <div className="w-75">
        <div className="text-center mb-4">
          <span className="h3">Plants</span>
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
          {currentPlants.map((plant) => (
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
                      {currentlyGrowing.some(
                        (growing) => growing.plant_id === plant.plant_id
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
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(filteredPlants.length / itemsPerPage) }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a
                    href="#!"
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </MDBContainer>
  );
}

export default Plants;
