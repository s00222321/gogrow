import React, { useState, useEffect } from 'react';
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBContainer
} from 'mdb-react-ui-kit';

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

const Plants: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('https://bmhnryodyk.execute-api.eu-west-1.amazonaws.com/v1');
        const responseData = await response.json();
        const data = JSON.parse(responseData.body);
        if (Array.isArray(data)) {
          setPlants(data);
        } else {
          console.error('No data available.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlants();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MDBContainer fluid className="d-flex flex-column justify-content-center align-items-center" style={{ paddingTop: '10%', paddingBottom: '10%' }}>
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
                        style={{ width: '60px', height: '60px', marginRight: '15px' }}
                      />
                      <div>
                        <p className="fw-bold mb-1">{plant.name}</p>
                        <p className="text-muted mb-0">{plant.season}</p>
                      </div>
                    </div>
                    <div>
                      <a href={`/plant/${plant.plant_id}`} role="button" style={{ color: 'grey', marginRight: '10px' }} data-mdb-toggle="tooltip" title="More information">
                        <i className="fas fa-info-circle fa-lg"></i>
                      </a>
                      <a href="#!" role="button" style={{ color: 'grey', marginRight: '10px' }} data-mdb-toggle="tooltip" title="Add to favourites">
                        <i className="fas fa-star fa-lg"></i>
                      </a>
                      <a href="#!" role="button" style={{ color: 'grey' }} data-mdb-toggle="tooltip" title="Add to my garden">
                        <i className="fas fa-plus fa-lg"></i>
                      </a>
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
