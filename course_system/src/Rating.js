import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";

class Rating extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,
            expanded: false,
            showModal: false,
        };
        this.rating = React.createRef();
    }

    setRating() {
        if (this.rating.current != null) {
            this.props.getRating(this.rating.current.value);
        }
    }

    getRatingOptions() {
        let ratingOption = [];
        ratingOption.push(<option key={0}>{"/"}</option>);
        ratingOption.push(<option key={1}>{"★"}</option>);
        ratingOption.push(<option key={2}>{"★★"}</option>);
        ratingOption.push(<option key={3}>{"★★★"}</option>);
        ratingOption.push(<option key={4}>{"★★★★"}</option>);
        ratingOption.push(<option key={5}>{"★★★★★"}</option>);
        return ratingOption;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.showModal !== state.showModal) {
            return {
                showModal: props.showModal
            };
        }
        return null;
    }

    closeModal() {
        this.props.closeModal();
    }



    render() {
        return (
            <Modal
                show={this.state.showModal}
                onHide={() => this.closeModal()}
                centered>
                <Modal.Header closeButton onClick={() => this.closeModal()}>
                    <Modal.Title>{"Rating " + this.props.data.name}</Modal.Title>
                    
                </Modal.Header>
                <Modal.Body>
                        <em>Please select rating in the dropdown box. More stars means higher rating.</em>
                </Modal.Body>
                <label style={{ padding: "50px" }}>
                    <Form.Group controlId="formRating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                            as="select"
                            ref={this.rating}
                            onChange={() => this.setRating()}
                        >
                            {this.getRatingOptions()}
                        </Form.Control>
                    </Form.Group>
                </label>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModal()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default Rating;
