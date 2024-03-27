const base64Pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
const base64URLSafePattern = /^([A-Za-z0-9_-]{4})*([A-Za-z0-9_-]{3}=|[A-Za-z0-9_-]{2}==)?$/;
const patternList = [base64Pattern, base64URLSafePattern];

let decodedTextMap = new Map();

function detectAndDecodePatternRecursive(node, pattern) {
  if (node.nodeType === Node.TEXT_NODE) {
    const matches = node.textContent.match(pattern);
    if (matches) {
        decodedTextMap.set(node, atob(matches[0])) ;
    }
  }

  for (let i = 0; i < node.childNodes.length; i++) {
    detectAndDecodePatternRecursive(node.childNodes[i], pattern);
  }
}

function insertNode(node, text) {
  const divTag = document.createElement("div");
  divTag.classList.add("decoded-text");

  const newNode = document.createTextNode(text);
  divTag.appendChild(newNode);

  const parentNode = node.parentNode;
  parentNode.insertBefore(divTag, node.nextSibling);
}

// 페이지 로드 완료 시 초기 디코딩 수행
document.addEventListener('DOMContentLoaded', () => {
  patternList.forEach(pattern => {
    detectAndDecodePatternRecursive(document.body, pattern);
  });

  for (const [node, text] of decodedTextMap.entries()) {
    insertNode(node, text);
  }

  decodedTextMap.clear();
});

// MutationObserver 생성 및 설정
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      patternList.forEach(pattern => {
        detectAndDecodePatternRecursive(node, pattern);
      });
    });
  });

  for (const [node, text] of decodedTextMap.entries()) {
    insertNode(node, text);
  }

  decodedTextMap.clear();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});