function hitBox(x, y, width, height, x1, y1, width1, height1) {
  if (x < x1 + width1 &&
     x + width > x1 &&
     y < y1 + height1 &&
     y + height > y1) {
      return true;
  }
}
