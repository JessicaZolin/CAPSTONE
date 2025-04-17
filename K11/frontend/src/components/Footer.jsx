import { Nav } from "react-bootstrap";

const Footer = () => {
  return (
    <div
      className="footer-container fixed-bottom d-flex"
      style={{ backgroundColor: "black", color: "white", height: "40px" }}
    >
      <div
        className="d-flex justify-content-evenly align-items-center "
        style={{ width: "100%" }}
      >
        <Nav className="">© 2025</Nav>
        <Nav className="">A.S.D.K11 - Be Your Best Self </Nav>
        <Nav className="d-none d-md-flex">
          Via dell'Artigianato, 4 - 36035 Vicenza
        </Nav>
      </div>
    </div>
  );
};

export default Footer;
