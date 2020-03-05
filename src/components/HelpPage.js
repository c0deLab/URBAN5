import React from 'react';
import PropTypes from 'prop-types';

function HelpPage(props) {
  const { displayType } = props;

  let helpText;
  switch (displayType) {
    case 'START':
      helpText = (
        <div>
          <p>Select START NEW SESSION to create a new project</p>
          <p>Open a previously saved project by clicking on one of the links.</p>
          <br />
          <div style={{ textAlign: 'center' }}>
            <video autoPlay autoPlay="true" loop>
              <source src="./imgs/startdemo.mp4" type="video/mp4" />
            </video>
            {/*<img src="./imgs/long.gif" alt="Usage Demo" style={{ width: '60%' }} />*/}
          </div>
          <br />
          <p>Press the PANIC button to return to the start page at any time.</p>
        </div>
      );
      break;
    case 'TOPO':
      helpText = (
        <div>
          <p>Click on the grid to change the elevation of the topography at that location.</p>
          <p>When INCRS HT is selected, clicking on the grid will increase the elevation. When DECRS HT is selected, the elevation will decrease.</p>
          <p>The maximum elevation is 6, and the minimum is 0.</p>
          <br />
          <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '40px' }}>
            <img src="./imgs/topoHelp.gif" style={{ width: '60%' }} alt="topo help" />
          </div>
          <p>Press the PANIC button to return to the TOPO page at any time.</p>
        </div>
      );
      break;
    case 'DRAW':
      helpText = (
        <div>
          <p>The DRAW page allows placing or removing objects (ADD CUBE/TREE/ROOF, DELETE), moving or rotating the view (STEP OUT, STEP  IN, LOOKLEFT, LOOKRGHT), and adding design constraints (SPEAK).</p>
          <p>Select actions from the text links in the top right. The active link will determine the effect of clicks in the design.</p>
          <p>The design is 7 units high with a topography of 17 by 17 units. A unit represents 10 ft.</p>
          <br />
          <div style={{ textAlign: 'center' }}>
            <img src="./imgs/long.gif" alt="Usage Demo" style={{ width: '60%' }} />
          </div>
          <br />
          <p>Press the PANIC button to return to the DRAW page at any time.</p>
        </div>
      );
      break;
    case 'SURF':
      helpText = (
        <div>
          <p>The SURF page allows placing or removing surfaces on cubes (SOLIDSRF, NO SRF) and moving or rotating the view (STEP OUT, STEP  IN, LOOKLEFT, LOOKRGHT).</p>
          <p>Select actions from the text links in the top right. The active link will determine the effect of clicks in the design.</p>
          <p>Surfaces determine access through buildings.</p>
          <p>The design is 7 units high with a topography of 17 by 17 units. A unit represents 10 ft.</p>
          <br />
          <div style={{ textAlign: 'center' }}>
            <img src="./imgs/long.gif" alt="Usage Demo" style={{ width: '60%' }} />
          </div>
          <br />
          <p>Press the PANIC button to return to the SURF page at any time.</p>
        </div>
      );
      break;
    case 'CALC':
      helpText = (
        <div>
          <p>The CALC page allows the user to calculate circulation through the design and to see a 3D walkthrough.</p>
          <p>First, select a start and end point on the top-down view of the design. Circles will be placed representing the start and end.</p>
          <p>After selection, an X will find its way through the design. Once a path has been calculated, a 3D walkthrough will be rendered.</p>
          <p>The circulation path can only move through open ground or surfaces that have been removed.</p>
          <br />
          <div style={{ textAlign: 'center' }}>
            <img src="./imgs/long.gif" alt="Usage Demo" style={{ width: '60%' }} />
          </div>
          <br />
          <p>Press the PANIC button to return to the CALC page at any time.</p>
        </div>
      );
      break;
    default:
      helpText = 'Press START to return to the start menu';
      break;
  }

  return (
    <div style={{ width: '1024px', height: '100%', float: 'left', padding: '20px' }}>
      <h3>{ `Help for: ${displayType} Page` }</h3>
      <div>{ helpText }</div>
    </div>
  );
}

HelpPage.propTypes = {
  displayType: PropTypes.string.isRequired
};

export default HelpPage;
