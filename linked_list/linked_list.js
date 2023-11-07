class Node {
  constructor(value = null, nextNode = null) {
    this.value = value;
    this.nextNode = nextNode;
  }
}

class LinkedList {
  #head = null;
  #tail = null;
  #length = 0;

  get head() {
    return this.#head?.value;
  }

  get tail() {
    return this.#tail?.value;
  }

  get size() {
    return this.#length;
  }

  prepend(value) {
    const secondNode = this.#head;
    this.#head = new Node(value, secondNode);

    if (!secondNode) {
      this.#tail = this.#head;
    }
    this.#length++;
  }

  append(value) {
    const newNode = new Node(value);
    this.#length++;

    if (!this.#head) {
      this.#head = newNode;
      this.#tail = newNode;
      return;
    }

    let currentNode = this.#head;
    while (currentNode.nextNode) {
      currentNode = currentNode.nextNode;
    }
    currentNode.nextNode = newNode;
    this.#tail = newNode;
  }

  insertAt(value, index) {
    if (!Number.isInteger(index) || index > this.size || index < 0) {
      throw new RangeError("Index is out of bound.");
    }
    if (index === 0) return this.prepend(value);
    if (index === size) return this.append(value);

    let currentNode = this.#head;
    for (let i = 1; i < index; i++) {
      currentNode = currentNode.nextNode;
    }
    const nextNode = currentNode?.nextNode;
    const newNode = new Node(value, nextNode);
    currentNode.nextNode = newNode;
    this.#length++;
  }

  at(index) {
    if (!Number.isInteger(index) || index >= this.size || index < 0) {
      throw new RangeError("Index is out of bound.");
    }
    let currentNode = this.#head;
    for (let i = 1; i <= index; i++) {
      currentNode = currentNode.nextNode;
    }
    return currentNode.value;
  }

  pop() {
    if (this.size === 0) throw new Error("List is empty!");

    if (this.size === 1) {
      const popValue = this.#head?.value;
      this.#head = null;
      this.#tail = null;
      this.#length--;
      return popValue;
    }
    let currentNode = this.#head;
    while (currentNode.nextNode !== this.#tail) {
      currentNode = currentNode.nextNode;
    }
    const popValue = this.#tail.value;
    currentNode.nextNode = null;
    this.#tail = currentNode;
    this.#length--;
    return popValue;
  }

  removeAt(index) {
    if (!Number.isInteger(index) || index > this.size || index < 0) {
      throw new RangeError("Index is out of bound.");
    }

    if (index === this.size - 1) return this.pop();
    if (index === 0) {
      const newHead = this.#head.nextNode;
      const removeValue = this.#head?.value;
      this.#head = newHead;
      this.#length--;
      if (this.size === 0) {
        this.#tail = null;
      }
      return removeValue;
    }
    let currentNode = this.#head;
    for (let i = 1; i < index; i++) {
      currentNode = currentNode.nextNode;
    }
    const removeValue = currentNode.nextNode?.value;
    currentNode.nextNode = currentNode.nextNode?.nextNode;
    this.#length--;
    return removeValue;
  }

  contains(value) {
    if (this.size === 0) return false;
    let currentNode = this.#head;
    while (currentNode !== this.#tail && currentNode.value !== value) {
      currentNode = currentNode.nextNode;
    }
    return currentNode.value === value;
  }

  find(value) {
    if (this.size === 0) return null;
    let currentNode = this.#head;
    let index = 0;
    while (currentNode !== this.#tail && currentNode.value !== value) {
      currentNode = currentNode.nextNode;
      index++;
    }
    if (currentNode.value === value) {
      return index;
    }
    return null;
  }

  toString() {
    console.log("size", this.size);
    if (this.size === 0) return "";
    let stringRepresentation = "";

    for (
      let currentNode = this.#head;
      currentNode !== null;
      currentNode = currentNode.nextNode
    ) {
      stringRepresentation += `(${currentNode.value}) -> ${
        !currentNode.nextNode ? "null" : ""
      }`;
    }
    return stringRepresentation;
  }
}
