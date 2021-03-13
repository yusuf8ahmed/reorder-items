import { reorder } from "../src/reorder";
import { Action, SortableItem } from "../src/reorder.types";
const fs = require("fs");

type Measurement = { name: string; duration: number };

let measurements: Measurement[] = [];

function measurePerformance(runs: number, columns: number, rows: number) {
  let grid: SortableItem[] = [];

  const actions: Action[] = [
    {
      type: "MOVE",
      id: "0-0",
      toColumn: 1,
      toOrder: 0,
    },
    {
      type: "INSERT",
      item: {
        id: "Q",
        order: 0,
      },
      order: 0,
      column: 0,
    },
    {
      type: "REMOVE",
      id: "0-0",
    },
  ];

  actions.forEach((action) => {
    for (var column = 0; column < columns; column++) {
      for (var order = 0; order < rows; order++) {
        grid.push({
          id: `${column}-${order}`,
          column,
          order,
        });
      }
    }

    const testId = `${runs} ${action.type} operations on a ${columns} x ${rows} grid`;

    console.time(testId);
    const start = process.hrtime.bigint();
    for (var i = 0; i < runs; i++) {
      reorder(grid, action);
    }
    const end = process.hrtime.bigint();
    const time = Number(end - start) / 1000 / 1000;
    console.timeEnd(testId);
    measurements.push({ name: testId, duration: time });
  });
  console.log("\n");
  fs.writeFileSync(
    "./performance/generated/results.json",
    JSON.stringify(measurements)
  );
}

// Increasing number of runs
measurePerformance(1, 100, 100);
measurePerformance(1, 100, 100);
// measurePerformance(1000, 100, 100);

// Increasing scale of grid
measurePerformance(1, 10, 100);
measurePerformance(1, 100, 100);
measurePerformance(1, 1000, 100);
measurePerformance(1, 100, 10);
measurePerformance(1, 100, 100);
measurePerformance(1, 100, 1000);

// Realistic worst case scenario
measurePerformance(1, 250, 20);
