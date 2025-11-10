const graphObject = document.getElementById("graph");
graphObject.style.opacity = 0;

const graphProperties = {
  sectionTopicsOpacity: 1,
  topicKnotsOpacity: 1,
  connectionsOpacity: 1,
  projectsOpacity: 1,
  sectionsOpacity: 1,
};

let svgLoaded = false;
graphObject.addEventListener("load", () => {
  svgLoaded = true;
  updateInteractiveGraph();
  graphObject.style.opacity = 1;

  const svgDoc = graphObject.contentDocument;
  const GRAPH_ELEMENTS = {
    TRANSFORM_ITERATIVE: Array.from(
      svgDoc.getElementById("Knoten_Themen").querySelectorAll("tspan")
    ).filter((tspan) =>
      ["TRANSFORM ", "ITERATIVE"].includes(tspan.textContent)
    ),
  };

  const infoBox = document.createElement("div");
  infoBox.classList.add("info-box");
  document.body.appendChild(infoBox);

  GRAPH_ELEMENTS.TRANSFORM_ITERATIVE.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      infoBox.textContent =
        "The „…process is given priority over outcome, embracing challenges such as uncertainty and failure, and striving to do things ‘better’ through renewed adjustments and tinkering.“ (Moriggi u. a. 2020, 293)";
      infoBox.style.opacity = "1";

      GRAPH_ELEMENTS.TRANSFORM_ITERATIVE.forEach((subElement) => {
        subElement.style.filter =
          "drop-shadow(0 0 20px yellow) drop-shadow(0 0 20px yellow) drop-shadow(0 0 20px yellow) drop-shadow(0 0 20px yellow)";
      });
    });

    element.addEventListener("mousemove", (e) => {
      infoBox.style.left = e.clientX + 15 + "px";
      infoBox.style.top = e.clientY + 15 + "px";
    });

    element.addEventListener("mouseleave", () => {
      infoBox.style.opacity = "0";
      GRAPH_ELEMENTS.TRANSFORM_ITERATIVE.forEach((subElement) => {
        subElement.style.filter = "";
      });
    });
  });
});

function updateInteractiveGraph() {
  if (!svgLoaded) {
    setTimeout(updateInteractiveGraph, 500);
    return;
  }
  const svgDoc = graphObject.contentDocument;

  //svgDoc.documentElement.style.cursor = "crosshair";
  svgDoc.documentElement.style.userSelect = "none";
  //svgDoc.documentElement.style.transition = "all 0.5s";

  const sectionEllipses = svgDoc
    .getElementById("Unterteilung")
    .querySelectorAll("ellipse, path, line"); // TODO Only ellipses.
  sectionEllipses.forEach((ellipseElement) => {
    ellipseElement.style.opacity = graphProperties.sectionsOpacity;
  });

  const topicKnots = svgDoc
    .getElementById("Knoten_Themen")
    .querySelectorAll("path, text");
  topicKnots.forEach((knotElement) => {
    knotElement.style.opacity = graphProperties.topicKnotsOpacity;
    /*const infoPanel = document.createElement("div");

    const boundingBox = knotElement.getBBox();
    const knotPoint = svgDoc.documentElement.createSVGPoint();
    knotPoint.x = boundingBox.x + boundingBox.width / 2;
    knotPoint.y = boundingBox.y + boundingBox.height / 2;

    const screenPoint = knotPoint.matrixTransform(
      svgDoc.documentElement.getScreenCTM()
    );

    infoPanel.style.position = "absolute";
    infoPanel.style.borderRadius = "1rem";
    infoPanel.style.scale = "0";
    infoPanel.style.transition = "all 0.2s";
    infoPanel.style.transform = "translate(-50%, -50%)";
    infoPanel.style.transformOrigin = "top left";
    infoPanel.style.left = screenPoint.x + "px";
    infoPanel.style.top = screenPoint.y + "px";
    infoPanel.style.width = "3rem";
    infoPanel.style.height = "3rem";
    infoPanel.style.backgroundColor = "blue";
    document.body.appendChild(infoPanel);

    knotElement.addEventListener("mouseenter", () => {
      infoPanel.style.scale = "1";
    });
    infoPanel.addEventListener("mouseleave", () => {
      infoPanel.style.scale = "0";
    });*/
  });

  const topicTexts = svgDoc.getElementById("Themen").querySelectorAll("text");
  topicTexts.forEach((textElement) => {
    textElement.style.opacity = graphProperties.sectionTopicsOpacity;
  });

  const connectionPaths = svgDoc
    .getElementById("Verbindungen")
    .querySelectorAll("path");
  connectionPaths.forEach((pathElement) => {
    pathElement.style.opacity = graphProperties.connectionsOpacity;
  });

  const projectsText = svgDoc
    .getElementById("Projekte_etc.")
    .querySelectorAll("text");
  projectsText.forEach((textElement) => {
    textElement.style.opacity = graphProperties.projectsOpacity;
  });
}
updateInteractiveGraph();

let scrollHeight;
function adaptToWindowSize() {
  scrollHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  updateInteractiveGraph();
}
adaptToWindowSize();
window.addEventListener("resize", adaptToWindowSize);

const stages = [
  // 1
  {
    callback: () => {
      graphObject.style.transform = "";
      graphProperties.connectionsOpacity = 0.1;
      graphProperties.projectsOpacity = 0.1;
      graphProperties.sectionTopicsOpacity = 1;
      graphProperties.sectionsOpacity = 1;
      graphProperties.topicKnotsOpacity = 0.1;
    },
  },
  // 2
  {
    callback: (scroll) => {
      graphObject.style.transform = "";
      graphProperties.connectionsOpacity = 0.1;
      graphProperties.projectsOpacity = 0.1;
      graphProperties.sectionTopicsOpacity = 1;
      graphProperties.sectionsOpacity = 1;
      graphProperties.topicKnotsOpacity = scroll * 5 + 0.1;
    },
  },
  // 3
  {
    callback: (scroll) => {
      graphObject.style.transform = "";
      graphProperties.connectionsOpacity = scroll * 5 + 0.1;
      graphProperties.projectsOpacity = 0.1;
      graphProperties.sectionTopicsOpacity = 1;
      graphProperties.sectionsOpacity = 1;
      graphProperties.topicKnotsOpacity = Math.max(1 - scroll * 5, 0) + 0.1;
    },
  },
  // 4
  {
    callback: (scroll) => {
      graphObject.style.transform = "";
      graphProperties.connectionsOpacity = 0.1;
      graphProperties.projectsOpacity = scroll * 5 + 0.1;
      graphProperties.sectionTopicsOpacity = 1;
      graphProperties.sectionsOpacity = 1;
      graphProperties.topicKnotsOpacity = 0.1;
    },
  },
  // 5
  {
    callback: (scroll) => {
      graphObject.style.transform = "";
      graphProperties.connectionsOpacity = scroll * 5 + 0.1;
      graphProperties.projectsOpacity = 1;
      graphProperties.sectionTopicsOpacity = 1;
      graphProperties.sectionsOpacity = 1;
      graphProperties.topicKnotsOpacity = scroll * 5 + 0.1;
    },
  },
  /*{
    callback: (scroll) => {
      graphObject.style.transform =
        "scale(2) translate(" + -scroll * 35 + "%, 0%)";
      graphProperties.connectionsOpacity = 1;
      graphProperties.projectsOpacity = 0.1;
      graphProperties.sectionTopicsOpacity = 1;
      graphProperties.sectionsOpacity = 1;
      graphProperties.topicKnotsOpacity = 1;
    },
  },
  {
    callback: (scroll) => {
      graphObject.style.transform =
        "scale(" +
        (2 - scroll) +
        ") translate(" +
        (-35 + scroll * 35) +
        "%, 0%)";
      graphProperties.connectionsOpacity = 1;
      graphProperties.projectsOpacity = scroll * 3 + 0.1;
      graphProperties.sectionTopicsOpacity = 1;
      graphProperties.sectionsOpacity = 1;
      graphProperties.topicKnotsOpacity = Math.max(1 - scroll * 3, 0) + 0.1;
    },
  },*/
];

function updateScrollEffect() {
  const relativeScrollY = window.scrollY / (scrollHeight - window.innerHeight);
  const currentStageIndex = Math.min(
    Math.floor(relativeScrollY * stages.length),
    stages.length - 1
  );
  const relativeStageScrollY =
    (relativeScrollY - currentStageIndex / stages.length) * stages.length;

  stages.forEach((_, stageIndex) => {
    let stageScroll = relativeStageScrollY;
    if (stageIndex < currentStageIndex) stageScroll = 1;
    if (stageIndex > currentStageIndex) stageScroll = 0;
    graphObject.style.transform = "";
    stages[stageIndex].callback(stageScroll);
  });
  stages[currentStageIndex].callback(relativeStageScrollY);
  updateInteractiveGraph();
}
window.addEventListener("scroll", updateScrollEffect);
updateScrollEffect();

console.assert(
  stages.length == document.getElementById("scroll-content").children.length,
  "Stage definition length does not match HTML stage length."
);
