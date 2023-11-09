class Node {
  constructor(key, value, left = null, right = null) {
    this.key = key;
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  #root = null;
  constructor(array) {
    this.#buildTree(array);
  }

  get height() {
    return this.#height(this.#root);
  }

  get isBalanced() {
    return this.#isBalanced(this.#root) !== -1;
  }

  depth(key) {
    return this.#depth(key);
  }

  prettyPrint() {
    this.#prettyPrint();
  }

  rebalance() {
    if (this.isBalanced) {
      return;
    }
    const sortedArray = this.inOrder();
    this.#root = this.#createBSTRec(sortedArray);
  }

  insert(key, value) {
    this.#insert(key, value);
  }

  delete(key) {
    // Case when key is in the root
    if (this.#root && this.#root.key === key) {
      return this.#deleteRootNode();
    }

    return this.#delete(key);
  }

  find(key) {
    return this.#find(key);
  }

  levelOrder(processValue = null) {
    if (!processValue) {
      return this.#levelOrder();
    }
    this.#levelOrderWithCallback(processValue);
  }

  inOrder(processValue = null) {
    if (!processValue) {
      return this.#inOrder();
    }
    this.#inOrderWithCallBack(processValue);
  }

  preOrder(processValue = null) {
    if (!processValue) {
      return this.#preOrder();
    }
    this.#preOrderWithCallBack(processValue);
  }

  postOrder(processValue = null) {
    if (!processValue) {
      return this.#postOrder();
    }
    this.#postOrderWithCallBack(processValue);
  }

  #buildTree(array) {
    const sortedArray = [...array]
      .sort((a, b) => a[0] - b[0])
      .filter(([key], i, arr) => i === 0 || arr[i - 1][0] !== key);
    this.#root = this.#createBSTRec(sortedArray);
  }

  #createBSTRec(array, start = 0, end = array.length - 1) {
    if (start > end) {
      return null;
    }
    const mid = Math.ceil((start + end) / 2);
    const left = this.#createBSTRec(array, start, mid - 1);
    const right = this.#createBSTRec(array, mid + 1, end);
    const [key, value] = array[mid];
    return new Node(key, value, left, right);
  }

  #prettyPrint(node = this.#root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.#prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.key}`);
    if (node.left !== null) {
      this.#prettyPrint(
        node.left,
        `${prefix}${isLeft ? "    " : "│   "}`,
        true
      );
    }
  }

  #insert(key, value, currentNode = this.#root) {
    if (currentNode.key === key) {
      currentNode.value = value;
      return;
    }

    if (key < currentNode.key) {
      if (!currentNode.left) {
        currentNode.left = new Node(key, value);
        return;
      }
      return this.#insert(key, value, currentNode.left);
    }

    if (!currentNode.right) {
      currentNode.right = new Node(key, value);
      return;
    }
    this.#insert(key, value, currentNode.right);
  }

  #deleteRootNode() {
    const rootValue = this.#root?.value;
    if (this.left && !this.right) {
      this.#root = this.left;
      return rootValue;
    }
    if (
      (this.#root.right && !this.#root.left) ||
      (this.#root.right && !this.#root.right.left)
    ) {
      this.#root = this.right;
      return rootValue;
    }

    let current = this.#root.right;
    while (current.left.left) {
      current = current.left;
    }
    this.#root.key = current.left.key;
    this.#root.value = current.left.value;
    current.left = null;
    return rootValue;
  }

  #delete(key, currentNode = this.#root) {
    // console.log(`key: ${currentNode?.key}`);
    // this.prettyPrint();

    const probablyDeleteNode =
      key < currentNode?.key ? currentNode?.left : currentNode?.right;

    if (!probablyDeleteNode) return null;

    if (probablyDeleteNode?.key !== key) {
      return this.#delete(key, probablyDeleteNode);
    }

    // Node to delete doesn't have one child
    if (!probablyDeleteNode.right || !probablyDeleteNode.left) {
      return this.#deleteNodeWithoutOneChild(currentNode, probablyDeleteNode);
    }

    // Node to delete has both left and right children
    return this.#deleteNodeWithBothChildren(probablyDeleteNode);
  }

  #deleteNodeWithBothChildren(deleteNode) {
    if (!deleteNode.left || !deleteNode.right) return null;
    const deleteValue = deleteNode.value;

    if (!deleteNode.right.left) {
      const replaceNodeFields = { ...deleteNode.right, left: deleteNode.left };
      Object.assign(deleteNode, replaceNodeFields);

      return deleteValue;
    }

    let parentNode = deleteNode.right;
    while (parentNode.left.left) {
      parentNode = parentNode.left;
    }
    const [key, value] = [parentNode.left.key, parentNode.left.value];
    Object.assign(deleteNode, { key, value });
    parentNode.left = null;

    return deleteValue;
  }

  #deleteNodeWithoutOneChild(parentNode, deleteNode) {
    const deleteValue = deleteNode.value;
    const nodeInsteadOfDeleted = deleteNode.left
      ? deleteNode.left
      : deleteNode.right;

    if (deleteNode === parentNode.left) {
      parentNode.left = nodeInsteadOfDeleted;
    } else if (deleteNode === parentNode.right) {
      parentNode.right = nodeInsteadOfDeleted;
    }
    return deleteValue;
  }

  #find(key, currentNode = this.#root) {
    if (!currentNode) return null;
    if (key === currentNode.key) {
      return currentNode.value;
    }
    const child = key < currentNode.key ? "left" : "right";
    return this.#find(key, currentNode[child]);
  }

  #inOrderWithCallBack(processValue, currentNode = this.#root) {
    if (!currentNode) return;

    this.#inOrderWithCallBack(processValue, currentNode.left);
    processValue(currentNode.key, currentNode.value);
    this.#inOrderWithCallBack(processValue, currentNode.right);

    return;
  }

  #inOrder(currentNode = this.#root) {
    if (!currentNode) return [];

    const inOrderValues = [];
    inOrderValues.push(...this.#inOrder(currentNode.left));
    inOrderValues.push([currentNode.key, currentNode.value]);
    inOrderValues.push(...this.#inOrder(currentNode.right));

    return inOrderValues;
  }

  #preOrderWithCallBack(processValue, currentNode = this.#root) {
    if (!currentNode) return;

    processValue(currentNode.key, currentNode.value);
    this.#preOrderWithCallBack(processValue, currentNode.left);
    this.#preOrderWithCallBack(processValue, currentNode.right);

    return;
  }

  #preOrder(currentNode = this.#root) {
    if (!currentNode) return [];
    const preOrderValues = [];
    preOrderValues.push([currentNode.key, currentNode.value]);
    preOrderValues.push(...this.#preOrder(currentNode.left));
    preOrderValues.push(...this.#preOrder(currentNode.right));

    return preOrderValues;
  }

  #postOrderWithCallBack(processValue, currentNode = this.#root) {
    if (!currentNode) return;

    this.#postOrderWithCallBack(processValue, currentNode.left);
    this.#postOrderWithCallBack(processValue, currentNode.right);
    processValue(currentNode.key, currentNode.value);

    return;
  }

  #postOrder(currentNode = this.#root) {
    if (!currentNode) return [];

    const postOrderValues = [];
    postOrderValues.push(...this.#postOrder(currentNode.left));
    postOrderValues.push(...this.#postOrder(currentNode.right));
    postOrderValues.push([currentNode.key, currentNode.value]);

    return postOrderValues;
  }

  #levelOrder() {
    const queue = this.#root ? [this.#root] : [];
    let levels = [];
    let nodesInCurrentLevel = 0;
    let nodesInNextLevel = 0;

    while (queue.length > 0) {
      if (nodesInCurrentLevel < 1) {
        levels.push([]);
        nodesInCurrentLevel = nodesInNextLevel;
        nodesInNextLevel = 0;
      }

      const current = queue.shift();
      if (current === null) {
        return levels;
      }
      nodesInCurrentLevel--;

      const lastIndex = levels.length - 1;
      levels[lastIndex].push([current.key, current.value]);

      if (current.left) {
        queue.push(current.left);
        nodesInNextLevel++;
      }
      if (current.right) {
        queue.push(current.right);
        nodesInNextLevel++;
      }
    }
    return levels;
  }

  #levelOrderWithCallback(processValue) {
    const queue = this.#root ? [this.#root] : [];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === null) return;

      processValue(current.key, current.value);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }

  #height(node) {
    if (!node) return 0;
    return 1 + Math.max(this.#height(node.left), this.#height(node.right));
  }

  #depth(key, node = this.#root) {
    if (!node) return -1;
    if (node.key === key) return 0;

    const child = key < node.key ? node.left : node.right;

    const result = this.#depth(key, child);
    if (result < 0) return -1;

    return 1 + result;
  }

  #isBalanced(node) {
    if (!node) return 0;
    const leftHeight = this.#isBalanced(node.left);
    if (leftHeight === -1) return -1;
    const rightHeight = this.#isBalanced(node.right);
    if (rightHeight === -1) return -1;

    if (Math.abs(rightHeight - leftHeight) > 1) {
      return -1;
    }

    return 1 + Math.max(leftHeight, rightHeight);
  }
}

const randomNumbers = Array(100)
  .fill()
  .map((_, i) => [Math.floor(Math.random() * 1000), Math.random()]);
const tree = new Tree(randomNumbers);
tree.prettyPrint();
console.log(tree.isBalanced);

const levels = tree.levelOrder();
console.log("Levels{");
levels.forEach((level) => {
  console.log(level.map((entry) => entry[0]));
});
console.log("}Levels");

console.log(tree.preOrder().map((entry) => entry[0]));
console.log(tree.inOrder().map((entry) => entry[0]));
console.log(tree.postOrder().map((entry) => entry[0]));

tree.insert(5000, 1);
tree.insert(5001, 2);
tree.insert(5002, 3);
tree.insert(5003, 4);
tree.insert(5004, 5);
tree.insert(5006, 7);

tree.prettyPrint();
console.log(tree.isBalanced);

tree.rebalance();
tree.prettyPrint();
console.log(tree.isBalanced);

console.log("Levels{");
levels.forEach((level) => {
  console.log(level.map((entry) => entry[0]));
});
console.log("}Levels");

console.log(tree.preOrder().map((entry) => entry[0]));
console.log(tree.inOrder().map((entry) => entry[0]));
console.log(tree.postOrder().map((entry) => entry[0]));

tree
  .inOrder()
  .map((entry) => entry[0])
  .forEach((key) => {
    if (key % 2 === 0) tree.delete(key);
  });

tree.prettyPrint();
console.log(tree.isBalanced);

tree.rebalance();
tree.prettyPrint();
console.log(tree.isBalanced);
