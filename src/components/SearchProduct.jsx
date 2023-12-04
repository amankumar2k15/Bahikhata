import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";

class SearchProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: true,
    };
  }

  render() {
    return (
      <div className="search-product">
        <InputGroup>
          <FormControl
            className="fs-12"
            placeholder="Search Product Here"
            aria-label="Search Product Here"
            aria-describedby="search-product"
          />
          <Button variant="primary fs-12 fs-w600" id="search-product-button">
            Search
          </Button>
        </InputGroup>
      </div>
    );
  }
}

export default SearchProduct;
