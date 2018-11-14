import React from 'react';
import PropTypes from 'prop-types';
import '../../Test.css';

import CamerasEnum from '../../js/enums/CamerasEnum';
import { TestViewCameraSlice, TestViewCamera } from '../../js/TestView';

export default class DisplayDeveloper extends React.Component {
  static propTypes = {
    controller: PropTypes.object,
    model: PropTypes.object
  }

  componentDidMount() {
    this.isWired = false;
    this.wire();
  }

  componentDidUpdate() {
    this.wire();
  }

  componentWillUnmount() {
    // Implement controller.removeListener()'s'
  }

  wire = () => {
    if (this.isWired) {
      return;
    }

    const { controller, model } = this.props;
    if (!controller || !model) {
      console.log('no controller/model');
      return;
    }

    for (let y = 0; y < 17; y += 1) {
      controller.addListener(new TestViewCameraSlice(document.getElementById(`testCanvasArrNS${y}`), model, controller, CamerasEnum.NORTH, y));
    }
    for (let x = 0; x < 17; x += 1) {
      controller.addListener(new TestViewCameraSlice(document.getElementById(`testCanvasArrEW${x}`), model, controller, CamerasEnum.EAST, x));
    }
    for (let z = 0; z < 7; z += 1) {
      controller.addListener(new TestViewCameraSlice(document.getElementById(`testCanvasArrTB${z}`), model, controller, CamerasEnum.TOP, z));
    }

    controller.addListener(new TestViewCamera(document.getElementById('testCanvas2'), model, controller, CamerasEnum.SOUTH, 'sliceYAxis'));
    controller.addListener(new TestViewCamera(document.getElementById('testCanvas3'), model, controller, CamerasEnum.NORTH, 'sliceYAxis'));
    controller.addListener(new TestViewCamera(document.getElementById('testCanvas4'), model, controller, CamerasEnum.EAST, 'sliceXAxis'));
    controller.addListener(new TestViewCamera(document.getElementById('testCanvas5'), model, controller, CamerasEnum.WEST, 'sliceXAxis'));
    controller.addListener(new TestViewCamera(document.getElementById('testCanvas6'), model, controller, CamerasEnum.TOP, 'sliceZAxis'));
    controller.addListener(new TestViewCamera(document.getElementById('testCanvas7'), model, controller, CamerasEnum.BOTTOM, 'sliceZAxis'));

    controller.updateViews();
    this.isWired = true;
  }

  render() {
    const { controller, model } = this.props;
    const camera = -1;

    const NSArray = [];
    const EWArray = [];
    const TBArray = [];
    if (controller && model) {
      for (let y = 16; y >= 0; y -= 1) {
        const id = `testCanvasArrNS${y}`;
        NSArray.push(<div key={`ns${y}`} className="testArr"><canvas id={id} width={120} height={120} /></div>);
      }
      for (let x = 0; x < 17; x += 1) {
        const id = `testCanvasArrEW${x}`;
        EWArray.push(<div key={`ew${x}`} className="testArr"><canvas id={id} width={200} height={200} /></div>);
      }
      for (let z = 6; z >= 0; z -= 1) {
        const id = `testCanvasArrTB${z}`;
        TBArray.push(<div key={`tb${z}`} className="testArr"><canvas id={id} width={200} height={200} /></div>);
      }
    }

    return (
      <div className="test">
        <div>
          <div style={{ position: 'absolute', top: 0, left: 100 }} className="northsouth">
            <h3>NORTH/SOUTH</h3>
            {NSArray}
          </div>
          <div style={{ position: 'absolute', top: 0, left: 300 }}>
            <h3>TOP/BOTTOM</h3>
            {TBArray}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 1000, left: 300 }} className="horizontal">
          <h3>EAST/WEST</h3>
          {EWArray}
        </div>
        <div style={{ position: 'absolute', top: 0, right: 220 }}>
          <table>
            <tbody>
              <tr>
                <td/>
                <td>
                  <h2 style={{ color: camera === CamerasEnum.SOUTH ? 'red' : 'black' }}>SOUTH</h2>
                  <canvas id="testCanvas2" width={200} height={200} style={{ transform: 'rotateX(180deg) rotateY(180deg)' }} />
                </td>
                <td/>
              </tr>
              <tr>
                <td>
                  <h2 style={{ color: camera === CamerasEnum.EAST ? 'red' : 'black' }}>EAST</h2>
                  <canvas id="testCanvas4" width={200} height={200} style={{ transform: 'rotateZ(90deg)' }} />
                </td>
                <td>
                  <h2 style={{ color: camera === CamerasEnum.TOP ? 'red' : 'black' }}>TOP</h2>
                  <canvas id="testCanvas6" width={200} height={200} />
                </td>
                <td>
                  <h2 style={{ color: camera === CamerasEnum.WEST ? 'red' : 'black' }}>WEST</h2>
                  <canvas id="testCanvas5" width={200} height={200} style={{ transform: 'rotateZ(-90deg)' }} />
                </td>
              </tr>
              <tr>
                <td/>
                <td>
                  <h2 style={{ color: camera === CamerasEnum.NORTH ? 'red' : 'black' }}>NORTH</h2>
                  <canvas id="testCanvas3" width={200} height={200} />
                </td>
                <td>
                  <h2 style={{ color: camera === CamerasEnum.BOTTOM ? 'red' : 'black' }}>BOTTOM</h2>
                  <canvas id="testCanvas7" width={200} height={200} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
