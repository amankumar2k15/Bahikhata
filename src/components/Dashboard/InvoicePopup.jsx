import React from "react";
import { Button, Modal } from "react-bootstrap";
import Invoice from "./Invoice";

const InvoicePopup = (state,setState) => {
  return (
    <Modal
      show={state.invoiceModalShow}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={true}
      backdrop={"static"}
      autoFocus={true}
    >
      <Modal.Header closeButton={false}>
        <Modal.Title
          className="text-primary fs-6 fs-w600"
          id="contained-modal-title-vcenter"
        >
          Invoice
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-muted fs-6">
        <Invoice invoiceState={state} />
      </Modal.Body>
      <Modal.Footer>
        <Button
        className="ms-auto"
          variant="danger fs-12 fs-w600"
          onClick={() => setState({ invoiceShow: false })}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoicePopup;
