
export interface CableSize {
  size: number; // mm²
  current: {
    pvc: {
      multiCore: {
        twoLoad: number; // 1P
        threeLoad: number; // 3P
      },
      singleCore: {
        twoLoad: number;
        threeTriangle: number;
        threeFlat: {
          adjacent: number;
          spaced: {
            horizontal: number;
            vertical: number;
          }
        }
      }
    },
    xlpe: {
      multiCore: {
        twoLoad: number; // 1P
        threeLoad: number; // 3P
      },
      singleCore: {
        twoLoad: number;
        threeTriangle: number;
        threeFlat: {
          adjacent: number;
          spaced: {
            horizontal: number;
            vertical: number;
          }
        }
      }
    }
  }
}
