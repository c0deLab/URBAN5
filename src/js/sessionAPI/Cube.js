import SurfacesEnum from '../enums/SurfacesEnum';

export default class Cube {
  constructor(cubeData) {
    if (cubeData) {
      const { surfaces } = cubeData;
      this.surfaces = surfaces;
    } else {
      this.surfaces = {
        n: SurfacesEnum.SOLID,
        e: SurfacesEnum.SOLID,
        s: SurfacesEnum.SOLID,
        w: SurfacesEnum.SOLID,
        t: SurfacesEnum.SOLID,
        b: SurfacesEnum.SOLID
      };
    }
  }

  hookAfterInsert = context => {
    const { n, e, s, w, t } = context;
    // Join to adjacent cubes (update both this one and the other)
    if (n && n.constructor.name === 'Cube') {
      this.surfaces.n = SurfacesEnum.NONE;
      n.surfaces.s = SurfacesEnum.NONE;
    }
    if (e && e.constructor.name === 'Cube') {
      this.surfaces.e = SurfacesEnum.NONE;
      e.surfaces.w = SurfacesEnum.NONE;
    }
    if (s && s.constructor.name === 'Cube') {
      this.surfaces.s = SurfacesEnum.NONE;
      s.surfaces.n = SurfacesEnum.NONE;
    }
    if (w && w.constructor.name === 'Cube') {
      this.surfaces.w = SurfacesEnum.NONE;
      w.surfaces.e = SurfacesEnum.NONE;
    }

    // Join to roof above
    if (t && t.constructor.name === 'Roof') {
      this.surfaces.t = SurfacesEnum.NONE;
    }

    // Join to adjacent roofs that face this cube
    if (n && n.constructor.name === 'Roof' && n.direction === 'n') {
      this.surfaces.n = SurfacesEnum.NONE;
      n.hasSideSurface = false;
    }
    if (e && e.constructor.name === 'Roof' && e.direction === 'e') {
      this.surfaces.e = SurfacesEnum.NONE;
      e.hasSideSurface = false;
    }
    if (s && s.constructor.name === 'Roof' && s.direction === 's') {
      this.surfaces.s = SurfacesEnum.NONE;
      s.hasSideSurface = false;
    }
    if (w && w.constructor.name === 'Roof' && w.direction === 'w') {
      this.surfaces.w = SurfacesEnum.NONE;
      w.hasSideSurface = false;
    }
  };

  hookBeforeRemove = context => {
    // check adjacent cubes and seal them?
    const { n, e, s, w, t } = context;
    if (n && n.constructor.name === 'Cube') {
      n.surfaces.s = SurfacesEnum.SOLID;
    }
    if (e && e.constructor.name === 'Cube') {
      e.surfaces.w = SurfacesEnum.SOLID;
    }
    if (s && s.constructor.name === 'Cube') {
      s.surfaces.n = SurfacesEnum.SOLID;
    }
    if (w && w.constructor.name === 'Cube') {
      w.surfaces.e = SurfacesEnum.SOLID;
    }

    // Readd floor from cube above
    if (t && t.constructor.name === 'Cube') {
      t.surfaces.b = SurfacesEnum.SOLID;
    }

    // Unjoin to adjacent roofs that face this cube
    if (n && n.constructor.name === 'Roof' && n.direction === 'n') {
      n.hasSideSurface = true;
    }
    if (e && e.constructor.name === 'Roof' && e.direction === 'e') {
      e.hasSideSurface = true;
    }
    if (s && s.constructor.name === 'Roof' && s.direction === 's') {
      s.hasSideSurface = true;
    }
    if (w && w.constructor.name === 'Roof' && w.direction === 'w') {
      w.hasSideSurface = true;
    }
  };

  setSurface = (sideCardinal, surface) => {
    this.surfaces[sideCardinal] = surface;
  };

  // Check if any wall has no surface
  hasAccessToOutside = context => {
    const { n, s, e, w } = context;
    if (this.surfaces.e === SurfacesEnum.NONE && e === null) {
      return true;
    }
    if (this.surfaces.w === SurfacesEnum.NONE && w === null) {
      return true;
    }
    if (this.surfaces.n === SurfacesEnum.NONE && n === null) {
      return true;
    }
    if (this.surfaces.s === SurfacesEnum.NONE && s === null) {
      return true;
    }
    return false;
  };

  hasAccessInDirection = direction => {
    if (this.surfaces[direction] === SurfacesEnum.NONE) {
      return true;
    }
    return false;
  };
}
