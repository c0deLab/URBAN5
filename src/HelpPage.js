import React from 'react';
import PropTypes from 'prop-types';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function HelpPage(props) {
  const { displayType } = props;

  let helpText;
  switch (displayType) {
    case 'START':
      helpText = (
        <div>
          <p>&#8226; Select START NEW SESSION to create a new project</p>
          <p>or</p>
          <p>&#8226; Select a link to open a previously saved project.</p>
        </div>
      );
      break;
    case 'TOPO':
      helpText = (
        <div>
          <p>Click on the grid to change the elevation of the topography.</p>
          <p>The maximum elevation is 6, and the minimum is 0.</p>
          <br />
          <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '40px' }}>
            <img src="./imgs/topoDemo.gif" alt="Usage Demo" style={{ height: '555px' }} />
          </div>
        </div>
      );
      break;
    case 'DRAW':
      helpText = (
        <div>
          <p>The DRAW page is for adding/removing objects and constraints. The world is 17x17x7 in dimension. Each unit represents 10 ft.</p>
          <br />
          <Tabs>
            <TabList>
              <Tab>ADD/DELETE</Tab>
              <Tab>CONSTRAINTS</Tab>
              <Tab>CAMERA CONTROLS</Tab>
            </TabList>

            <TabPanel>
              <p>Users can add and delete cubes, roofs, and trees.</p>
              <div style={{ textAlign: 'center' }}>
                <img src="./imgs/adddeleteDemo.gif" alt="Usage Demo" style={{ height: '555px' }} />
              </div>
            </TabPanel>
            <TabPanel>
              <p>Users can add constraints for maximum height, maximum area, and minimum distance to access by selecting SPEAK, typing the constraint, and pressing ENTER.</p>
              <br />
              <p>Examples include:</p>
              <ul>
                <li>&quot;The maximum height for buildings is 30ft tall.&quot;</li>
                <li>&quot;The total area of the building should be less than 500 sqft&quot;</li>
                <li>&quot;No area should be more than 30 ft from access.&quot;</li>
              </ul>
            </TabPanel>
            <TabPanel>
              <p>Users can move the camera view by selecting step in/step out or lookleft/lookrght.</p>
              <div style={{ textAlign: 'center' }}>
                <img src="./imgs/cameraDemo.gif" alt="Usage Demo" style={{ height: '555px' }} />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      );
      break;
    case 'SURF':
      helpText = (
        <div>
          <p>The SURFACE page is for adding and removing surfaces on buildings. Surfaces determine access to buildings.</p>
          <br />
          <Tabs>
            <TabList>
              <Tab>ADD/REMOVE</Tab>
              <Tab>CAMERA CONTROLS</Tab>
            </TabList>

            <TabPanel>
              <p>Users can add or remove surfaces on the sides of cubes.</p>
              <div style={{ textAlign: 'center' }}>
                <img src="./imgs/surfDemo.gif" alt="Usage Demo" style={{ height: '555px' }} />
              </div>
            </TabPanel>
            <TabPanel>
              <p>Users can move the camera view by selecting step in/step out or lookleft/lookrght.</p>
              <div style={{ textAlign: 'center' }}>
                <img src="./imgs/cameraDemo.gif" alt="Usage Demo" style={{ height: '555px' }} />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      );
      break;
    case 'CALC':
      helpText = (
        <div>
          <p>The CALC page allows the user to calculate circulation through the design and to see a 3D walkthrough.</p>
          <p>To do a walkthrough, select a start and end point on the top-down view of the design.</p>
          <br />
          <div style={{ textAlign: 'center' }}>
            <img src="./imgs/calcDemo.gif" alt="Usage Demo" style={{ height: '555px' }} />
          </div>
        </div>
      );
      break;
    default:
      helpText = 'Press the PANIC button to return.';
      break;
  }

  return (
    <div style={{ width: '984px', height: '100%', float: 'left', padding: '20px' }}>
      <h3>{ `Help for: ${displayType} Page` }</h3>
      <hr />
      <div style={{ paddingTop: '8px', lineHeight: '30px' }}>{ helpText }</div>
      <p style={{ position: 'absolute', top: '1016px' }}>{ `Press the PANIC button to return to the ${displayType} page at any time.` }</p>
    </div>
  );
}

HelpPage.propTypes = {
  displayType: PropTypes.string.isRequired
};

export default HelpPage;
