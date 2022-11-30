export {};

declare global {
  interface Window {
    assert: (test: boolean, message: string) => void;
    assertEqual: (a: any, b: any, message?: string) => void;
    assertEqFloat: (
      a: number,
      b: number,
      precision: number,
      message?: string
    ) => void;
    assertEqFloatArr: (
      a: arr1d,
      b: arr1d,
      precision: number,
      message?: string
    ) => void;
  }

  var assert: (test: boolean, message: string) => void;
  var assertEqual: (a: any, b: any, message?: string) => void;
  var assertEqFloat: (
    a: number,
    b: number,
    precision: number,
    message?: string
  ) => void;
  var assertEqFloatArr: (
    a: arr1d,
    b: arr1d,
    precision: number,
    message?: string
  ) => void;
}
