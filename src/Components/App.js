import React from 'react';
import ControlPanel from './ControlPanel'
import CurrentAnimation from './CurrentAnimation'
import { Container, Row, Col } from 'react-bootstrap'
function App() {
  return (
    <>
      <Container>
        <Row>
          <Col xs={4}>
          <ControlPanel />
          </Col>
          <Col xs={8}>
            <CurrentAnimation />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
