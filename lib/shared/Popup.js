import * as util from 'vis-util/esnext';

import './Popup.css';

/**
 * Popup is a class to create a popup window with some text
 */
class Popup {
  /**
   * @param {Canvas} canvas           The canvas object.
   * @param {string} overflowMethod   How the popup should act to overflowing ('flip' or 'cap')
   * @param {boolean} tooltipSticky   Whether or not the popup should be sticky (and thus allow the cursor within it)
   */
  constructor(canvas, overflowMethod, tooltipSticky) {
    this.canvas = canvas;
    this.container = canvas.frame;
    this.overflowMethod = overflowMethod || 'cap';
    this.tooltipSticky  = tooltipSticky;

    this.x = 0;
    this.y = 0;
    this.left = 0;
    this.top = 0;
    this.padding = 5;
    this.hidden = false;

    // create the frame
    this.frame = document.createElement('div');
    this.frame.className = 'vis-tooltip';
    this.container.appendChild(this.frame);
  }

  /**
   * @param {number} x   Horizontal position of the popup window
   * @param {number} y   Vertical position of the popup window
   */
  setPosition(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }

  /**
   * Set the content for the popup window. This can be HTML code or text.
   * @param {string | Element} content
   */
  setText(content) {
    if (content instanceof Element) {
      this.frame.innerHTML = '';
      this.frame.appendChild(content);
    }
    else {
      this.frame.innerHTML = content; // string containing text or HTML
    }
  }

  /**
   * Update current position of the popup
   */
  updatePosition() {
    var height = this.frame.clientHeight;
    var width = this.frame.clientWidth;
    var maxHeight = this.frame.parentNode.clientHeight;
    var maxWidth = this.frame.parentNode.clientWidth;

    if (this.overflowMethod == 'flip') {
      var isLeft = false, isTop = true; // Where around the position it's located

      if (this.y - height < this.padding) {
        isTop = false;
      }

      if (this.x + width > maxWidth - this.padding) {
        isLeft = true;
      }

      if (isLeft) {
        this.left = this.x - width;
      } else {
        this.left = this.x;
      }

      if (isTop) {
        this.top = this.y - height;
      } else {
        this.top = this.y;
      }
    } else {
      this.top = (this.y - height);
      if (this.top + height + this.padding > maxHeight) {
        this.top = maxHeight - height - this.padding;
      }
      if (this.top < this.padding) {
        this.top = this.padding;
      }

      this.left = this.x;
      if (this.left + width + this.padding > maxWidth) {
        this.left = maxWidth - width - this.padding;
      }
      if (this.left < this.padding) {
        this.left = this.padding;
      }
    }

    this.frame.style.left = this.left + "px";
    this.frame.style.top = this.top + "px";
    this.frame.style.visibility = "visible";
    this.hidden = false;
  }

  /**
   * Check if this object is overlapping with the provided object
   * @param {Object} obj   an object with parameters left, top, right, bottom
   * @return {boolean}     True if cursor is located within the popup
   */
  isOverlappingWith(obj) {
    // var objDOM = this.canvas.canvasToDOM({ x: obj.left, y: obj.top });

    // console.log('=== isoverlay')
    // console.log(domObjPosition)
    // console.log({x: this.x, y: this.y, width: this.x + this.frame.clientWidth, height: this.y + this.frame.clientHeight})

    // return (
    //   objPositionDOM.left > this.x &&
    //   obj.right < domPosition.x + this.frame.clientWidth &&
    //   domPosition.top > obj.top &&
    //   obj.bottom < domPosition.y + this.frame.clientHeight
    // );


    console.log('======== container')
    console.log(this.container)
    console.log(this.container.frame)



    // var popupPositionCanvas = this.canvas.DOMtoCanvas({ x: this.x, y: this.y });

    // console.log(obj)
    // // console.log({ ...popupPositionCanvas, width: popupPositionCanvas.x + this.frame.clientWidth, height: popupPositionCanvas.y + this.frame.clientHeight })
    // console.log('-----')
    // console.log({ objLeft: obj.left, thisX: popupPositionCanvas.x })
    // console.log({ objRight: obj.right, thisRight: (popupPositionCanvas.x + this.frame.offsetWidth) })
    // console.log({ objTop: obj.top, thisY: popupPositionCanvas.y })
    // console.log({ objBottom: obj.bottom, thisBottom: (popupPositionCanvas.y + this.frame.offsetHeight) })
    // console.log({
    //   result: obj.left > popupPositionCanvas.x &&
    //     obj.right < (popupPositionCanvas.x + this.frame.offsetWidth) &&
    //     obj.top > popupPositionCanvas.y &&
    //     obj.bottom < (popupPositionCanvas.y + this.frame.offsetHeight)
    // });
    // console.log('=======')

    // return (
    //   obj.left > popupPositionCanvas.x &&
    //   obj.right < (popupPositionCanvas.x + this.frame.clientWidth) &&
    //   obj.top > popupPositionCanvas.y &&
    //   obj.bottom < (popupPositionCanvas.y + this.frame.clientHeight)
    // );
    return true;
  }

  /**
   * Show the popup window
   * @param {boolean} [doShow]    Show or hide the window
   */
  show(doShow) {
    if (doShow === undefined) {
      doShow = true;
    }

    if (doShow === true) {
      if (this.tooltipSticky === true) {
        console.log('======== tooltip is sticky')
        if (this.left === 0 && this.top === 0) {
          console.log('======== updating sticky position')
          this.updatePosition();
        }
      }
      else {
        console.log('======== updating NON-sticky position')
        this.updatePosition();
      }
    }
    else {
      this.hide();
    }
  }

  /**
   * Hide the popup window
   */
  hide() {
    this.hidden = true;
    this.frame.style.left = "0";
    this.frame.style.top = "0";
    this.frame.style.visibility = "hidden";
  }

  /**
   * Remove the popup window
   */
  destroy() {
    this.frame.parentNode.removeChild(this.frame); // Remove element from DOM
  }
}

export default Popup;
