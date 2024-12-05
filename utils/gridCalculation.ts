interface GridDimensions {
  rows: number;
  columns: number;
}

export function calculateOptimalGrid(pieces: number, width: number, height: number): GridDimensions {
  const aspectRatio = width / height;
  
  const baseCells = Math.sqrt(pieces);
  const idealRows = Math.sqrt(pieces / aspectRatio);
  const idealCols = pieces / idealRows;
  
  let bestRows = Math.round(idealRows);
  let bestCols = Math.round(idealCols);
  let bestScore = Infinity;
  
  const minRows = Math.max(1, Math.floor(idealRows * 0.8));
  const maxRows = Math.ceil(idealRows * 1.2);
  
  for (let rows = minRows; rows <= maxRows; rows++) {
    const cols = Math.ceil(pieces / rows);
    const gridRatio = cols / rows;
    
    const ratioDiff = Math.abs(gridRatio - aspectRatio);
    const extraCells = (rows * cols) - pieces;
    const cellRatio = (width / cols) / (height / rows);
    const cellDeformity = Math.abs(1 - cellRatio);
    
    const score = (ratioDiff * 2) + (extraCells * 0.5) + cellDeformity;
    
    if (score < bestScore) {
      bestScore = score;
      bestRows = rows;
      bestCols = cols;
    }
  }
  
  return {
    rows: bestRows,
    columns: bestCols
  };
}

