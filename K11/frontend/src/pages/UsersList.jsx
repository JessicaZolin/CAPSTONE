import { Card, Container, Row, Button, Col } from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";

function UsersList() {
  const { user } = UserAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchUsers = async () => {
    
    const response = await axios.get( `${process.env.REACT_APP_BACKEND_URL}/users`);
    console.log(response.data);
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <Button
        className="container-main align-items-center color-button-546a76-bg-white"
        onClick={() => navigate("/admin-dashboard")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-arrow-left mb-1 me-2"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        Back to Dashboard
      </Button>

      <Container className="my-5">
        <Row xs={1} md={2} className="g-4">
          {users.map((user) => (
            <Col key={user._id} xs={12} md={6} lg={4} className="mb-5">
              <UserCard user={user} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default UsersList;
