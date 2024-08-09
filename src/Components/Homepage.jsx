import { Alert, Button, Col, Container, FormControl, Image, InputGroup, Navbar, Row, Stack } from "react-bootstrap";
import logoGif from '../assets/images/logo-taipc-unscreen.gif';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Hompage() {
    return <>
        <Container fluid>
            <Row>
                <Col lg={12}>
                    
                        <div className="text-primary fw-bold position-fixed start-0 top-0 text-start bg-dark">
                            <Stack direction="horizontal" gap={3}>
                                <div>
                                    <Image src={logoGif} alt="logo" className="d-block" />
                                    <Image src="https://images.cooltext.com/5704001.png" width="100%" alt="sub-logo" />
                                </div>
                                <div className="">
                                    <FontAwesomeIcon icon={faBars} size="lg" />
                                    <span>Danh mục</span>
                                </div>
                                <div className="">
                                <InputGroup>
                                    <FormControl
                                        placeholder="Tìm kiếm..."
                                        aria-label="Search"
                                        aria-describedby="basic-addon2"
                                    />
                                    <Button variant="primary" id="button-addon2">
                                    <FontAwesomeIcon icon={faSearch} />
                                    </Button>
                                </InputGroup>
                                </div>
                            </Stack>
                        </div>
                </Col>
            </Row>
        </Container>
        {/* <Stack direction="horizontal" gap={2}>
            <Button as="a" variant="primary">
                Button as link
            </Button>
            <Button as="a" variant="success">
                Button as link
            </Button>
        </Stack>; */}
        
    </>
}