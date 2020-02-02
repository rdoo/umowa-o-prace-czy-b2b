import '@testing-library/jest-dom/extend-expect';

// createRange is not provided by jsDOM
// used by MUI tooltip
(global as any).document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document
  }
});
