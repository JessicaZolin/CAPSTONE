import { Container, Row, Col, Pagination, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import { ButtonComponent } from "../components/Buttons";

function UsersList() {
  const { token } = UserAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users?page=${currentPage}&limitPerPage=6`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (error) {
      console.log("Error fetching users:", error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  return (
    <div className="container">
      <ButtonComponent
        text={"Admin Dashboard"}
        as={Link}
        to={"/admin-dashboard"}
      />

      <Container className="my-5">
        <div className="d-flex justify-content-center align-items-center">
          {loading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {error && <p className="text-danger">{error}</p>}
        </div>
        <Row xs={1} md={2} className="g-4">
          {!loading &&
            users.map((user) => (
              <Col key={user._id} xs={12} md={6} lg={4} className="mb-5">
                <UserCard user={user} />
              </Col>
            ))}
        </Row>

        {!loading && totalPages > 1 && (
          <Row>
            <Col className="d-flex justify-content-center my-4">
              <Pagination className="m-0">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                />
              </Pagination>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default UsersList;
