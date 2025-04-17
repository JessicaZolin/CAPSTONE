import { Container, Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <>
      <Container className="container-main mt-4 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    </>
  );
};

export default Loading;