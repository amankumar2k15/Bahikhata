import { Button, Container, Form, InputGroup } from "react-bootstrap";
import SearchProduct from "./SearchProduct";

const DatePickers = (props) => {
  return <Container fluid className="date-filter-section">
    { props.currentTab !== "inventory" ?
      <InputGroup>
        <Form.Label className="date-picker-label fs-12">From Date</Form.Label>
        <input className="date-picker" type="date" />
        <Form.Label className="date-picker-label fs-12">To Date</Form.Label>
        <input className="date-picker" type="date" />
        <Button variant="outline-secondary" id="search-product-button" className="btn-primary date-search-button">search</Button>
      </InputGroup> : null
    }
    <SearchProduct />
  </Container>
}

export default DatePickers;