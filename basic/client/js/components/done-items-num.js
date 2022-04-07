class DoneItemsNum {
  constructor(doneItemsNum) {
    this.span = document.querySelector('span.done-items-num__value');
    this.doneItemsNum = doneItemsNum;
  }

  render() {
    this.span.innerHTML = this.doneItemsNum;
  }
}

export default DoneItemsNum;
