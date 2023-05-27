import { Button, Form, Alert } from 'react-bootstrap';
import { MemoElevatorCar } from './components';
import { useElevatorSystem } from './useElevatorSystem';

import './styles.css';

function App() {
  const {
    building,
    handleAddElevatorCar,
    handleDestroyBuilding,
    handleCreateBuilding,
    handleCallElevator,
    handleRandomData,
    handleRemoveElevatorCar,
    setFloors,
    setCurrentFloor,
    setTargetFloor,
    setExecutionTime,
    currentFloor,
    targetFloor,
    executionTime,
    floors,
    isRandomMode,
  } = useElevatorSystem();

  const maxFloor = building.floors !== null ? building.floors : 1;

  return (
    <div className="app">
      <div className="control-panel">
        <Form>
          <h3>System Settings</h3>
          {building.floors === null && !isRandomMode ? (
            <Form.Group>
              <Form.Label htmlFor="floors">Floors</Form.Label>
              <Form.Control
                id="floors"
                type="number"
                min="10"
                placeholder="10"
                onChange={(e) => setFloors(parseInt(e.target.value))}
              />
            </Form.Group>
          ) : (
            <p>Building is {building.floors} floor(s) height, with {building.elevators.length} elevator cars.</p>
          )}

          {building.floors && !isRandomMode && (
            <>
              <Button variant="primary" onClick={handleAddElevatorCar}>
                Add Elevator Car
              </Button>{' '}
              <Button variant="danger" onClick={handleDestroyBuilding}>
                Destroy Building
              </Button>{' '}
            </>
          )}
          {building.floors === null && (
            <>
              <Button
                variant="primary"
                className="mt-3"
                disabled={floors === 0}
                onClick={handleCreateBuilding}
              >
                Create Building
              </Button>{' '}
            </>
          )}
        </Form>
        {building.elevators.length > 0 && !isRandomMode && (
          <Form className="mt-3">
            <h3>Call elevator</h3>
            <Form.Group>
              <Form.Label htmlFor="currentFloor">Current Floor</Form.Label>
              <Form.Control
                id="currentFloor"
                type="number"
                min="1"
                max={maxFloor}
                placeholder="1"
                onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
              />

              <Form.Label
                htmlFor="targetFloor"
                className="mt-3"
              >
                Target Floor
              </Form.Label>
              <Form.Control
                id="targetFloor"
                type="number"
                min="1"
                max={maxFloor}
                placeholder="10"
                onChange={(e) => setTargetFloor(parseInt(e.target.value))}
              />
            </Form.Group>

            <Button
              variant="primary"
              className="mt-3"
              disabled={currentFloor === 0 || targetFloor === 0}
              onClick={handleCallElevator}
            >
              Call
            </Button>
          </Form>
        )}
        <Form className="mt-3">
          <h3>Randomizer</h3>
          <p>
            The Randomizer will create requests for the trip during a specified amount of time.
            On each tick it creates a random amount of requests between 5 and 10. <b>Tick equals 5000 MS</b>.
          </p>
          <Alert variant="warning">
            Please note that <b>after the execution time ends</b>, some elevator cars may <b>still be in motion</b>.
          </Alert>
          <Form.Group>
            <Form.Label htmlFor="executionTime">
              Randomizer execution time (MS)
            </Form.Label>
            <Form.Control
              id="executionTime"
              type="number"
              step="5000"
              min="5000"
              placeholder="10000"
              onChange={(e) => setExecutionTime(parseInt(e.target.value))}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="mt-3"
            disabled={executionTime === null}
            onClick={handleRandomData}
          >
            Start
          </Button>
        </Form>
      </div>
      <div className="elevators-container">
        {building.elevators.map(({ elevatorId, elevatorCurrentFloor, elevatorState }) =>
          <MemoElevatorCar
            key={elevatorId}
            id={elevatorId}
            floor={elevatorCurrentFloor}
            state={elevatorState}
            handleRemove={handleRemoveElevatorCar}
          />
        )}
      </div>
    </div>
  );
}

export default App;
