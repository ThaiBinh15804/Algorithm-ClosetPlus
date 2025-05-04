type FPNode = {
  item: string | null
  count: number
  children: FPNode[]
}

const colorPalette = [
  "#fb8500",
  "#ffb703",
  "#0077b6",
  "#a7c957",
  "#e3d5ca",
  "#bc4749",
  "#ff5400",
  "#c1121f",
  "#2b2d42",
  "#00f5d4",
  "#e4c1f9",
  "#7678ed",
  "#b2967d",
  "#0f4c5c",
  "#fb6f92",
  "#344e41",
  "#6c584c",
  "#ff4d6d",
  "#6d4c3d"
]

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorPalette.length)
  return randomIndex
}

export default function TreeNode({ node }: { node: FPNode }) {
  const NODE_SIZE = 60
  const H_GAP = 100
  const V_GAP = 20

  // Tính tổng chiều rộng các node con để căn giữa
  const totalWidth =
    node.children && node.children.length > 0
      ? node.children.length * NODE_SIZE + (node.children.length - 1) * H_GAP
      : 0

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        {/* Node chính */}
        <div style={{ position: "relative", padding: 10 }}>
          <div
            style={{
              width: NODE_SIZE,
              height: NODE_SIZE,
              borderRadius: "50%",
              backgroundColor: colorPalette[getRandomColor()],
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold"
            }}
          >
            {node.count === 0 ? "Root" : node.item + ":" + node.count}
          </div>
        </div>

        {/* Các node con */}
        {node.children?.length > 0 && (
          <div
            style={{
              width: totalWidth,
              marginTop: 0,
              position: "relative",
              minHeight: V_GAP + NODE_SIZE // Đảm bảo đủ chỗ cho SVG và node con
            }}
          >
            {/* SVG vẽ các đường nối */}
            <svg
              width={totalWidth}
              height={V_GAP}
              style={{
                display: "block",
                margin: "0 auto",
                pointerEvents: "none",
                zIndex: 1,
                position: "relative", // Đổi từ absolute sang relative
                top: 0,
                left: 0
              }}
            >
              {node.children.map((_, idx) => {
                const xChild = idx * (NODE_SIZE + H_GAP) + NODE_SIZE / 2
                const xParent = totalWidth / 2
                return (
                  <line
                    key={idx}
                    x1={xParent}
                    y1={0}
                    x2={xChild}
                    y2={V_GAP}
                    stroke="#000"
                    strokeWidth={2}
                  />
                )
              })}
            </svg>
            {/* Hiển thị từng node con */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
                marginTop: 0,
                zIndex: 2,
                position: "relative"
              }}
            >
              {node.children.map((child, idx) => (
                <div key={idx} style={{ width: NODE_SIZE, marginRight: idx < node.children.length - 1 ? H_GAP : 0 }}>
                  <TreeNode node={child} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
