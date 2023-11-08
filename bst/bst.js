class Node {
  constructor(value, left = null, right = null) {
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
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    this.#root = this.#createBSTRec(sortedArray);
  }

  #createBSTRec(array, start = 0, end = array.length - 1) {
    if (start > end) {
      return null;
    }
    const mid = Math.ceil((start + end) / 2);
    const left = this.#createBSTRec(array, start, mid - 1);
    const right = this.#createBSTRec(array, mid + 1, end);
    const value = array[mid];
    return new Node(value, left, right);
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
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.#prettyPrint(
        node.left,
        `${prefix}${isLeft ? "    " : "│   "}`,
        true
      );
    }
  }

  insert(value) {
    this.#insert(value);
  }

  #insert(value, currentNode = this.#root) {
    if (currentNode.value === value) return;

    if (value < currentNode.value) {
      if (!currentNode.left) {
        currentNode.left = new Node(value);
        return;
      }
      return this.#insert(value, currentNode.left);
    }

    if (!currentNode.right) {
      currentNode.right = new Node(value);
      return;
    }
    this.#insert(value, currentNode.right);
  }

  delete(value) {
    // Case when value is in the root
    if (this.#root && this.#root.value === value) {
      return this.#deleteRootNode();
    }
    return this.#delete(value);
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
    this.#root.value = current.left.value;
    current.left = null;
    return rootValue;
  }

  #delete(value, currentNode = this.#root) {
    console.log(`value: ${currentNode?.value}`);
    this.prettyPrint();
    if (!currentNode) return false;
    // Value is in the left subtree
    if (value < currentNode.value) {
      // Value is deeper than left child
      if (currentNode.left?.value !== value) {
        return this.#delete(value, currentNode.left);
      }
      // Value is in the left child node
      const deleteNode = currentNode.left;

      // Node to delete doesn't have right child
      if (!deleteNode.right) {
        currentNode.left = deleteNode.left;
        return true;
      }
      // Node to delete doesn't have left child
      if (!deleteNode.left || (deleteNode.left && !deleteNode.right.left)) {
        currentNode.left = deleteNode.right;
        return true;
      }

      // Node to delete has both left and right children
      let parentOfNodeInsteadOfDeletedNode = deleteNode.right;
      while (parentOfNodeInsteadOfDeletedNode.left.left) {
        parentOfNodeInsteadOfDeletedNode =
          parentOfNodeInsteadOfDeletedNode.left;
      }
      deleteNode.value = parentOfNodeInsteadOfDeletedNode.left.value;
      parentOfNodeInsteadOfDeletedNode.left = null;
      return true;
    }

    // Value is in the right subtree

    // Value is deeper than right child
    if (currentNode.right?.value !== value) {
      return this.#delete(value, currentNode.right);
    }
    // Value is in the right child node
    const deleteNode = currentNode.right;

    // Node to delete doesn't have right child
    if (!deleteNode.right) {
      currentNode.right = deleteNode.left;
      return true;
    }
    // Node to delete doesn't have left child
    if (!deleteNode.left || (deleteNode.left && !deleteNode.right.left)) {
      currentNode.left = deleteNode.right;
      return true;
    }

    // Node to delete has both left and right children
    let parentOfNodeInsteadOfDeletedNode = deleteNode.right;
    while (parentOfNodeInsteadOfDeletedNode.left.left) {
      parentOfNodeInsteadOfDeletedNode = parentOfNodeInsteadOfDeletedNode.left;
    }
    deleteNode.value = parentOfNodeInsteadOfDeletedNode.left.value;
    parentOfNodeInsteadOfDeletedNode.left = null;
    return true;
  }
}

const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
tree.prettyPrint();
tree.insert(6500);
tree.insert(80);
console.log();
tree.prettyPrint();
console.log(tree.delete(67));
console.log();
tree.prettyPrint();
