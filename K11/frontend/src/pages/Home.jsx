import { useState, useEffect } from "react";
import { Container, Row, Col, Pagination, Spinner } from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import ExerciseCard from "../components/ExerciseCard";

const Home = () => {
  const { user, mongoUser } = UserAuth();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchExercises = async () => {
      
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/exercises?page=${currentPage}&limitPerPage=6`
        );
        setExercises(response.data.exercises);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (error) {
        console.log("Error fetching exercises:", error);
        setError(error.message);
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [currentPage]);

  return (
    <>
      <Container className="d-flex flex-column gap-2">
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Row style={{ height: "100%"}} className="d-flex align-items-center">
          <h3 className="mb-3">Exercises</h3>
          {!loading ? (
            exercises.map((exercise) => (
              <Col key={exercise._id} xs={12} md={6} lg={4} className="mb-5">
                <ExerciseCard exercise={exercise} />
              </Col>
            ))
          ) : (
            <Col>
              <p>No exercises found.</p>
            </Col>
          )}
        </Row>

        {totalPages > 1 && (
          <Row>
                <Col className="d-flex justify-content-center my-4">
                    <Pagination className="m-0">
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                    </Pagination>
                </Col>
                </Row>
            )}
      </Container>
    </>
  );
};

export default Home;
