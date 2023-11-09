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

  prettyPrint() {
    this.#prettyPrint();
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

  insert(key, value) {
    this.#insert(key, value);
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

  delete(key) {
    // Case when key is in the root
    if (this.#root && this.#root.key === key) {
      return this.#deleteRootNode();
    }
    return this.#delete(key);
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
}

const tree = new Tree(
  [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324].map((i) => [i, i * 100])
);

tree.prettyPrint();

tree.insert(6500);
tree.insert(80, 8000);
console.log("Insert 80:");
tree.prettyPrint();
console.log("Delete 80");
console.log(tree.delete(80));
tree.prettyPrint();
console.log("Delete 7");
console.log(tree.delete(7));
console.log();
tree.prettyPrint();
console.log("delete 4");
console.log(tree.delete(4));
console.log();
tree.prettyPrint();

console.log("delete 324");
console.log(tree.delete(324));
console.log();
tree.prettyPrint();

console.log("delete 67");
console.log(tree.delete(67));
console.log();
tree.prettyPrint();
