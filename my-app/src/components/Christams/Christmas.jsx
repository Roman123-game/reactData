import "./Christmas.css";

export default function ChristmasTree() {
    return (
        <div className="xmas-container">
            <div className="xmas-star">⭐</div>

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

                    <div className="gift-inside">
                        <svg className="teddy-svg"
                            id="Layer_1" enable-background="new 0 0 511.588 511.588" viewBox="0 0 511.588 511.588" xmlns="http://www.w3.org/2000/svg"><path d="m390.724 397.827c-1.036-27.141-14.531-47.101-39.028-57.724-27.569-11.957-67.52-1.46-101.501 25.017 5.413-19.454 12.961-45.896 18.437-62.323 26.297-78.229 32.347-174.254 9.817-252.082-4.189-39.891-43.344-62.736-79.699-44.162-20.022 10.229-29.33 39.084-37.541 64.542-3.91 12.122-7.604 23.571-11.876 31.32-9.073 16.454-3.848 36.73 15.217 42.717.716 23.573-9.333 78.603-17.237 109.269-11.085 47.811-23.647 102.001-26.5 187.183-.49 14.666 11.208 27.353 25.829 28.088-7.083 9.938-10.992 21.899-10.992 34.416 0 4.142 3.357 7.5 7.5 7.5h86.977c9.697 0 9.697-15 0-15h-78.849c1.758-10.347 7.145-19.782 15.369-26.621.099-.083.188-.173.282-.259h109.519c8.31 6.789 13.866 16.388 15.676 26.88h-17.997c-9.697 0-9.697 15 0 15h26.14c4.143 0 7.5-3.4 7.5-7.542 0-12.415-3.966-24.406-11.012-34.338h57.234c10.879 0 20.686-6.43 24.983-16.381 4.759-11.019 12.615-32.883 11.752-55.5zm-25.522 49.552c-1.924 4.452-6.325 7.329-11.214 7.329h-205.938c-7.65-.755-11.732-4.962-12.245-12.622 2.086-62.321 10.966-107.572 17.639-146.509 2.683-15.656 12.726-31.728 34.763-37.202 32.727-8.131 37.808-42.257 38.008-43.706 1.013-9.848-13.103-11.814-14.854-2.084-.153 1.042-4.005 25.576-26.771 31.232-8.868 2.203-16.063 6.045-21.883 10.6 4.167-17.988 8.076-35.122 11.062-52.644 4.36-25.591 5.607-43.937 5.774-55.836 11.455-1.547 20.989-7.544 31.675-14.993 7.956-5.545-.622-17.852-8.576-12.306-13.647 9.513-21.513 13.583-32.037 12.541-11.272-1.115-12.538-13.539-8.137-21.522 13.556-23.952 20.214-77.479 43.106-89.748 29.149-14.891 52.697 4.377 58.068 33.411 1.029 12.895-3.756 28.379-25.192 41.272-8.31 4.998-.578 17.853 7.73 12.854 11.537-6.939 19.545-14.879 24.735-23.262 13.071 68.264 5.692 147.453-16.513 213.868-8.788 26.365-22.324 76.236-25.031 86.276-2.698 3.038-9.584 10.816-16.236 18.519-6.271 7.259 4.911 17.267 11.352 9.804 7.925-9.176 16.192-18.467 17.166-19.561 32.311-34.086 77.042-50.951 104.078-39.226 41.546 16.64 31.449 66.475 19.471 93.515z" /></svg>

                    </div>
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
