import React from "react";
import Card from "react-bootstrap/Card";
import { Button, Col, Container, Row} from "react-bootstrap";
import Rating from "./Rating";

import "./App.css";

class CompletedCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            showModal: false,
            rate: -1,
        };
    }

    closeModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    getCredits() {
        if (this.props.data.credits === 1) return "1 credit";
        else return this.props.data.credits + " credits";
    }

    getRating(score) {
        this.setState({rate: score});
        this.props.setRating(this.props.data.number,score);
    }

    setExpanded(value) {
        this.setState({ expanded: value });
    }

    getExpansionButton() {
        let buttonText = "▼";
        let buttonOnClick = () => this.setExpanded(true);

        if (this.state.expanded) {
            buttonText = "▲";
            buttonOnClick = () => this.setExpanded(false);
        }

        return (
            <Button
                variant="outline-dark"
                style={{
                    width: 25,
                    height: 25,
                    fontSize: 12,
                    padding: 0,
                    position: "absolute",
                    right: 20,
                    top: 20,
                }}
                onClick={buttonOnClick}
            >
                {buttonText}
            </Button>
        );
    }

    getDescription() {
        if (this.state.expanded) {
            return <div>{this.props.data.description}</div>;
        }
    }

    getScoreDisplay() {
        if (this.state.rate <= 0) {
            return <p>Unrated</p>
        } else if (this.state.rate === 1) {
            return <p>{this.state.rate}</p>
        } else {
            return <p>{this.state.rate}</p>
        }
    }

    render() {
        return (
            <React.Fragment>
                <Card style={{ width: "33%", marginTop: "5px", marginBottom: "5px" }}>
                    <Card.Body>
                        <Card.Title>
                            <div style={{ maxWidth: 250 }}>{this.props.data.name}</div>
                            {this.getExpansionButton()}
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            {this.props.data.number} - {this.getCredits()}
                        </Card.Subtitle>
                        {this.getDescription()}
                        <Container>
                            <Row>
                                <Col style={{ display: "flex", justifyContent: 'flex-head' }}>
                                    {this.getScoreDisplay()}
                                </Col>
                                <Col style={{ display: "flex", justifyContent: 'flex-end' }}>
                                    <Button className="right" variant="dark" style={{ marginTop: "5px", marginBottom: "5px" }} onClick={() => this.setState({ showModal: !this.state.showModal })}>
                                        Rate
                                    </Button>
                                </Col>
                                <Col style={{ display: "flex", justifyContent: 'flex-end' }}>
                                    <Button className="right" variant="dark" style={{ marginTop: "5px", marginBottom: "5px", padding: "5px"}} onClick={() => this.setState({ showModal: !this.state.showModal })}>
                                        Comment
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
                <div id="ratingPage">
                    <Rating data={this.props.data} showModal={this.state.showModal} closeModal={() => this.closeModal()} getRating={(rate) => this.getRating(rate)}/>
                </div>
            </React.Fragment>
        );
    }
}

export default CompletedCourse;
