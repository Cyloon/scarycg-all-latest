import { CatmullRomLine } from "@react-three/drei";

function CurvePath() {
  //define controls points for the curve
  const points = [
    [
      [-6, 0, -9], // Starting point Left 4
      [-1, 0, -6], // Control point 1
      [-0.15, 0, 0], // Middle point
      [-0.1, 0, 10], // Control point 2
      [-0.05, 0, 17], // Control point 3
      [0, 0, 27], // Ending point
    ],
    [
      [6, 0, -9], // Starting point Right 4
      [1, 0, -6], // Control point 1
      [0.15, 0, 0], // Middle point
      [0.1, 0, 10], // Control point 2
      [0.05, 0, 17], // Control point 3
      [0, 0, 27], // Ending point
    ],
    [
      [-6, 0, 0], // Starting point Left 3
      [-1, 0, 1], // Control point 1
      [-0.8, 0, 5], // Middle point
      [-0.5, 0, 10], // Control point 2
      [-0.4, 0, 17], // Control point 3
      [-0, 0, 23], // Ending point
    ],
    [
      [6, 0, 0], // Starting point Right 3
      [1, 0, 1], // Control point 1
      [0.8, 0, 5], // Middle point
      [0.5, 0, 10], // Control point 2
      [0.4, 0, 17], // Control point 3
      [0, 0, 27], // Ending point
    ],
    [
      [-6, 0, 5], // Starting point Left 2
      [-1.5, 0, 6], // Control point 1
      [-0.8, 0, 10], // Middle point
      [-0.5, 0, 17], // Control point 2
      [-0, 0, 27], // Ending point
    ],
    [
      [6, 0, 5], // Starting point Right 2
      [1.5, 0, 6], // Control point 1
      [0.8, 0, 10], // Middle point
      [0.5, 0, 17], // Control point 2
      [0, 0, 27], // Ending point
    ],
    [
      [-5, 0, 12], // Starting point Left 1
      [-2, 0, 13], // Control point 1
      [-1.5, 0, 14], // Middle point
      [-0.9, 0, 17], // Control point 2
      [-0, 0, 23], // Ending point]
    ],
    [
      [5, 0, 12], // Starting point Right 1
      [2, 0, 13], // Control point 1
      [1.5, 0, 14], // Middle point
      [0.9, 0, 17], // Control point 2
      [0, 0, 23], // Ending point]
    ],
  ];
  return (
    //render the curve in the scene so you can see it
    <>
      <CatmullRomLine
        points={points[0]}
        closed={false}
        color="orange"
        lineWidth={4}
      />
      <CatmullRomLine
        points={points[1]}
        closed={false}
        color="orange"
        lineWidth={4}
      />
      <CatmullRomLine
        points={points[2]}
        closed={false}
        color="orange"
        lineWidth={4}
      />
      <CatmullRomLine
        points={points[3]}
        closed={false}
        color="orange"
        lineWidth={4}
      />
      <CatmullRomLine
        points={points[4]}
        closed={false}
        color="orange"
        lineWidth={4}
      />
      <CatmullRomLine
        points={points[5]}
        closed={false}
        color="orange"
        lineWidth={4}
      />
      <CatmullRomLine
        points={points[6]}
        closed={false}
        color="orange"
        lineWidth={4}
      />
      <CatmullRomLine
        points={points[7]}
        closed={false}
        color="orange"
        lineWidth={4}
      />
    </>
  );
}

export default CurvePath;
