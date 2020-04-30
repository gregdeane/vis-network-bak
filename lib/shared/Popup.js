import './Popup.css';

/**
 * Popup is a class to create a popup window with some text
 */
class Popup {
  /**
   * @param {Element} container       The container object.
   * @param {boolean} tooltipSticky   Whether or not the popup should be sticky (and thus allow the cursor within it)
   * @param {string}  overflowMethod  How the popup should act to overflowing ('flip' or 'cap')
   */
  constructor(container, tooltipSticky, overflowMethod) {
    this.container = container;
    this.tooltipSticky = tooltipSticky;
    this.overflowMethod = overflowMethod || 'cap';

    this.x = 0;
    this.y = 0;
    this.left = 0;
    this.top = 0;
    this.padding = 5;
    this.hidden = false;

    // create the frame
    this.frame = document.createElement('div');
    this.frame.className = `vis-tooltip${tooltipSticky === true ? ' vis-tooltip-sticky' : ''}`;
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

  setViewStyle() {
    this.frame.style.left = this.left + "px";
    this.frame.style.top = this.top + "px";
    this.frame.style.visibility = "visible";
    this.hidden = false;
  }

  /**
   * Check if this object is overlapping with the provided object
   * @param {Object} enhancedPointerObj   Object with enhanced pointer values
   * @return {boolean}                    True if cursor is located within the popup
   */
  isOverlappingWith(enhancedPointerObj) {
    let DOMValues = enhancedPointerObj.DOM;

    return (
      DOMValues.left > (this.left - this.padding) &&
      DOMValues.right < (this.left + this.padding + this.frame.clientWidth) &&
      DOMValues.top > (this.top + this.padding) &&
      DOMValues.bottom < (this.top + this.frame.clientHeight)
    );
  }

  /**
   * Update popup position
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

    this.setViewStyle();
  }

  /**
   * Show the popup window
   */
  show(enhancedPointer) {
    if (this.tooltipSticky === true) {
      // set/update position first time only
      if (this.left === 0 && this.top === 0) {
        this.setPosition(enhancedPointer.DOM.left, enhancedPointer.DOM.top - 10);
        this.updatePosition();
      } else {
        this.setViewStyle();
      }
    }
    else {
      this.updatePosition();
    }
  }

  /**
   * Hide the popup window
   */
  hide() {
    this.left = 0;
    this.top = 0;
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
