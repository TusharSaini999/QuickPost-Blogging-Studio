class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


class BST:
    def __init__(self):
        self.root = None

    # INSERT
    def insert(self, key):
        self.root = self._insert(self.root, key)

    def _insert(self, node, key):
        if node is None:
            return Node(key)

        if key < node.data:
            node.left = self._insert(node.left, key)
        elif key > node.data:
            node.right = self._insert(node.right, key)

        return node

    # SEARCH
    def search(self, key):
        return self._search(self.root, key)

    def _search(self, node, key):
        if node is None or node.data == key:
            return node

        if key < node.data:
            return self._search(node.left, key)
        else:
            return self._search(node.right, key)

    # FIND MIN (for deletion)
    def _find_min(self, node):
        while node.left:
            node = node.left
        return node

    # DELETE
    def delete(self, key):
        self.root = self._delete(self.root, key)

    def _delete(self, node, key):
        if node is None:
            return node

        if key < node.data:
            node.left = self._delete(node.left, key)

        elif key > node.data:
            node.right = self._delete(node.right, key)

        else:
            # Case 1: No child
            if node.left is None and node.right is None:
                return None

            # Case 2: One child
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left

            # Case 3: Two children
            min_node = self._find_min(node.right)
            node.data = min_node.data
            node.right = self._delete(node.right, min_node.data)

        return node

    # TRAVERSALS
    def inorder(self):
        self._inorder(self.root)
        print()

    def _inorder(self, node):
        if node:
            self._inorder(node.left)
            print(node.data, end=" ")
            self._inorder(node.right)

    def preorder(self):
        self._preorder(self.root)
        print()

    def _preorder(self, node):
        if node:
            print(node.data, end=" ")
            self._preorder(node.left)
            self._preorder(node.right)

    def postorder(self):
        self._postorder(self.root)
        print()

    def _postorder(self, node):
        if node:
            self._postorder(node.left)
            self._postorder(node.right)
            print(node.data, end=" ")


# Example Usage
bst = BST()
values = [50, 30, 70, 20, 40, 60, 80]

for v in values:
    bst.insert(v)

print("Inorder:")
bst.inorder()

print("Search 40:", "Found" if bst.search(40) else "Not Found")

bst.delete(30)
print("Inorder after deletion:")
bst.inorder()
