import SurfacesEnum from './enums/SurfacesEnum';
import Cube from './Cube';

export default class Roof {
  static typeName = 'ROOF'

  constructor(roofData) {
    if (roofData) {
      const { direction, hasSideSurface } = roofData;
      this.direction = direction;
      this.hasSideSurface = hasSideSurface;
    } else {
      this.direction = 'n';
      this.hasSideSurface = true;
    }
  }

  // Join cube surfaces that connect
  hookAfterInsert = (modifier, context) => {
    this.direction = modifier;

    const { n, e, s, w, b } = context;

    // Join to roof above
    if (b && b.constructor === Cube) {
      b.surfaces.t = SurfacesEnum.NONE;
    }

    // Join to adjacent cubes that face this roof
    if (n && n.constructor === Cube && this.direction === 's') {
      n.surfaces.s = SurfacesEnum.NONE;
      this.hasSideSurface = false;
    }
    if (e && e.constructor === Cube && this.direction === 'w') {
      e.surfaces.w = SurfacesEnum.NONE;
      this.hasSideSurface = false;
    }
    if (s && s.constructor === Cube && this.direction === 'n') {
      s.surfaces.n = SurfacesEnum.NONE;
      this.hasSideSurface = false;
    }
    if (w && w.constructor === Cube && this.direction === 'e') {
      w.surfaces.e = SurfacesEnum.NONE;
      this.hasSideSurface = false;
    }

    // Join to adjacent roofs
    if (n && (n.constructor === Roof && n.direction === 'n') && this.direction === 's') {
      n.hasSideSurface = false;
      this.hasSideSurface = false;
    }
    if (e && (e.constructor === Roof && e.direction === 'e') && this.direction === 'w') {
      e.hasSideSurface = false;
      this.hasSideSurface = false;
    }
    if (s && (s.constructor === Roof && s.direction === 's') && this.direction === 'n') {
      s.hasSideSurface = false;
      this.hasSideSurface = false;
    }
    if (w && (w.constructor === Roof && w.direction === 'w') && this.direction === 'e') {
      w.hasSideSurface = false;
      this.hasSideSurface = false;
    }
  };

  hookBeforeRemove = context => {
    const { n, e, s, w, b } = context;
    // Unjoin adjacent cubes
    if (b && b.constructor === Cube) {
      b.surfaces.t = SurfacesEnum.SOLID;
    }
    if (n && n.constructor === Cube && this.direction === 's') {
      n.surfaces.s = SurfacesEnum.SOLID;
    }
    if (e && e.constructor === Cube && this.direction === 'w') {
      e.surfaces.w = SurfacesEnum.SOLID;
    }
    if (s && s.constructor === Cube && this.direction === 'n') {
      s.surfaces.n = SurfacesEnum.SOLID;
    }
    if (w && w.constructor === Cube && this.direction === 'e') {
      w.surfaces.e = SurfacesEnum.SOLID;
    }

    // Unjoin adjacent roofs
    if (n && (n.constructor === Roof && n.direction === 'n') && this.direction === 's') {
      n.hasSideSurface = true;
    }
    if (e && (e.constructor === Roof && e.direction === 'e') && this.direction === 'w') {
      e.hasSideSurface = true;
    }
    if (s && (s.constructor === Roof && s.direction === 's') && this.direction === 'n') {
      s.hasSideSurface = true;
    }
    if (w && (w.constructor === Roof && w.direction === 'w') && this.direction === 'e') {
      w.hasSideSurface = true;
    }
  };

  setSurface = (sideCardinal, surface) => {
    if (surface === SurfacesEnum.NONE) {
      switch (sideCardinal) {
        case 'n':
          if (this.direction === 's') {
            this.hasSideSurface = false;
          }
          break;
        case 's':
          if (this.direction === 'n') {
            this.hasSideSurface = false;
          }
          break;
        case 'e':
          if (this.direction === 'w') {
            this.hasSideSurface = false;
          }
          break;
        case 'w':
          if (this.direction === 'e') {
            this.hasSideSurface = false;
          }
          break;
        default:
          break;
      }
    }
  };
}
