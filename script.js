// Neural Network Animation and Visualization Code
const nodes = {
  input: ['input1', 'input2', 'input3'],
  hidden1: ['hidden1_1', 'hidden1_2', 'hidden1_3', 'hidden1_4'],
  hidden2: ['hidden2_1', 'hidden2_2', 'hidden2_3', 'hidden2_4'],
  output: ['output1', 'output2']
};

function getNodePosition(nodeId) {
  const node = document.getElementById(nodeId);
  const rect = node.getBoundingClientRect();
  const parentRect = node.parentElement.parentElement.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - parentRect.left,
    y: rect.top + rect.height / 2 - parentRect.top
  };
}

function drawConnections() {
  const svg = document.getElementById('connections-svg');
  svg.innerHTML = ''; // Clear existing lines

  // Input to Hidden Layer 1
  nodes.input.forEach(inputNodeId => {
    nodes.hidden1.forEach(hiddenNodeId => {
      const startPos = getNodePosition(inputNodeId);
      const endPos = getNodePosition(hiddenNodeId);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', startPos.x);
      line.setAttribute('y1', startPos.y);
      line.setAttribute('x2', endPos.x);
      line.setAttribute('y2', endPos.y);
      line.setAttribute('class', 'connection');
      svg.appendChild(line);
    });
  });

  // Hidden Layer 1 to Hidden Layer 2
  nodes.hidden1.forEach(hiddenNode1Id => {
    nodes.hidden2.forEach(hiddenNode2Id => {
      const startPos = getNodePosition(hiddenNode1Id);
      const endPos = getNodePosition(hiddenNode2Id);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', startPos.x);
      line.setAttribute('y1', startPos.y);
      line.setAttribute('x2', endPos.x);
      line.setAttribute('y2', endPos.y);
      line.setAttribute('class', 'connection');
      svg.appendChild(line);
    });
  });

  // Hidden Layer 2 to Output
  nodes.hidden2.forEach(hiddenNodeId => {
    nodes.output.forEach(outputNodeId => {
      const startPos = getNodePosition(hiddenNodeId);
      const endPos = getNodePosition(outputNodeId);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', startPos.x);
      line.setAttribute('y1', startPos.y);
      line.setAttribute('x2', endPos.x);
      line.setAttribute('y2', endPos.y);
      line.setAttribute('class', 'connection');
      svg.appendChild(line);
    });
  });
}

function activateNode(nodeId) {
  const node = document.getElementById(nodeId);
  node.classList.add('active');
}

function deactivateNode(nodeId) {
  const node = document.getElementById(nodeId);
  node.classList.remove('active');
}

function activateConnectionsBetween(nodeIds1, nodeIds2) {
  const svg = document.getElementById('connections-svg');
  const lines = svg.querySelectorAll('.connection');
  lines.forEach(line => {
    const x1 = parseFloat(line.getAttribute('x1'));
    const y1 = parseFloat(line.getAttribute('y1'));
    const x2 = parseFloat(line.getAttribute('x2'));
    const y2 = parseFloat(line.getAttribute('y2'));

    nodeIds1.forEach(nodeId1 => {
      const pos1 = getNodePosition(nodeId1);
      nodeIds2.forEach(nodeId2 => {
        const pos2 = getNodePosition(nodeId2);
        if (
          (Math.abs(pos1.x - x1) < 1 && Math.abs(pos1.y - y1) < 1 && Math.abs(pos2.x - x2) < 1 && Math.abs(pos2.y - y2) < 1) ||
          (Math.abs(pos1.x - x2) < 1 && Math.abs(pos1.y - y2) < 1 && Math.abs(pos2.x - x1) < 1 && Math.abs(pos2.y - y1) < 1)
        ) {
          line.classList.add('active');
        }
      });
    });
  });
}

function deactivateAllConnections() {
  const svg = document.getElementById('connections-svg');
  const lines = svg.querySelectorAll('.connection');
  lines.forEach(line => {
    line.classList.remove('active');
  });
}

let currentStep = 0;
const animationSteps = [];

function setupAnimationSequence() {
  drawConnections();

  nodes.input.forEach(nodeId => {
    animationSteps.push(() => activateNode(nodeId));
  });

  animationSteps.push(() => activateConnectionsBetween(nodes.input, nodes.hidden1));

  nodes.hidden1.forEach(nodeId => {
    animationSteps.push(() => activateNode(nodeId));
  });

  animationSteps.push(() => activateConnectionsBetween(nodes.hidden1, nodes.hidden2));

  nodes.hidden2.forEach(nodeId => {
    animationSteps.push(() => activateNode(nodeId));
  });

  animationSteps.push(() => activateConnectionsBetween(nodes.hidden2, nodes.output));

  nodes.output.forEach(nodeId => {
    animationSteps.push(() => activateNode(nodeId));
  });

  animationSteps.push(() => {
    nodes.input.forEach(deactivateNode);
    nodes.hidden1.forEach(deactivateNode);
    nodes.hidden2.forEach(deactivateNode);
    nodes.output.forEach(deactivateNode);
    deactivateAllConnections();
  });
}

function runAnimation() {
  if (currentStep === 0) {
    setupAnimationSequence();
  }

  if (currentStep < animationSteps.length) {
    animationSteps[currentStep]();
    currentStep++;
    setTimeout(runAnimation, 500);
  } else {
    currentStep = 0;
    setTimeout(runAnimation, 2000); // Restart after 2 seconds
  }
}

window.addEventListener('resize', () => {
  drawConnections();
});

runAnimation();
