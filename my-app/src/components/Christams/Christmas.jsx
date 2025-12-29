import "./Christmas.css";

export default function ChristmasTree() {
  return (
    <div className="xmas-container">
      <div className="xmas-star">✦</div>

      <div className="xmas-tree">
        <div className="tree-layer layer-top"></div>
        <div className="tree-layer layer-middle"></div>
        <div className="tree-layer layer-bottom"></div>

        <div className="garland g1"></div>
        <div className="garland g2"></div>

        <span className="ornament red o1" />
        <span className="ornament gold o2" />
        <span className="ornament blue o3" />
        <span className="ornament purple o4" />
        <span className="ornament gold o5" />

        <span className="light l1" />
        <span className="light l2" />
        <span className="light l3" />
        <span className="light l4" />
        <span className="light l5" />
        <span className="light l6" />
      </div>

      <div className="tree-trunk"></div>

      {/* PRESENTS */}
      <div className="presents">
        <div className="present p1">
          <span className="ribbon-v"></span>
          <span className="ribbon-h"></span>
        </div>
        <div className="present p2">
          <span className="ribbon-v"></span>
          <span className="ribbon-h"></span>
        </div>
        <div className="present p3">
          <span className="ribbon-v"></span>
          <span className="ribbon-h"></span>
        </div>
      </div>

      <div className="tree-shadow"></div>
    </div>
  );
}
