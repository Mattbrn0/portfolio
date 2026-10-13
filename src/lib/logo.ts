type Vec3 = [number, number, number];

export const logoGeometry = {
  count: 30,
  inner: 0.52,
  outer: 1,
  height: 0.13,
  taper: 0.55,
  twist: 0.6,
  tilt: 0.72,
  roll: Math.PI / 4,
} as const;

export function bladeFrame(index: number) {
  const { count, twist } = logoGeometry;
  const angle = (index / count) * Math.PI * 2;
  const radial: Vec3 = [Math.cos(angle), Math.sin(angle), 0];
  const width: Vec3 = [-Math.sin(angle) * Math.sin(twist), Math.cos(angle) * Math.sin(twist), Math.cos(twist)];
  return { radial, width };
}

function project([x, y, z]: Vec3): [number, number] {
  const { tilt, roll } = logoGeometry;
  const y1 = y * Math.cos(tilt) - z * Math.sin(tilt);
  const z1 = y * Math.sin(tilt) + z * Math.cos(tilt);
  const depth = 5 / (5 - z1);
  const xs = x * depth;
  const ys = y1 * depth;
  return [xs * Math.cos(roll) - ys * Math.sin(roll), -(xs * Math.sin(roll) + ys * Math.cos(roll))];
}

export function logoBlades() {
  const { count, inner, outer, height, taper } = logoGeometry;
  return Array.from({ length: count }, (_, index) => {
    const { radial, width } = bladeFrame(index);
    const corners: [number, number][] = [
      [inner, -taper],
      [outer, -1],
      [outer, 1],
      [inner, taper],
    ];
    return corners
      .map(([r, s]) => {
        const half = (s * height) / 2;
        const point: Vec3 = [
          radial[0] * r + width[0] * half,
          radial[1] * r + width[1] * half,
          width[2] * half,
        ];
        return project(point)
          .map((value) => value.toFixed(3))
          .join(",");
      })
      .join(" ");
  });
}
