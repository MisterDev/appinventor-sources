/**
 * Created by emeryotopalik on 7/7/15.
 */
/**
 * @license
 * @fileoverview Object representing a glorified code comment, called a textbubble.
 * Based on Neil Fraser's implementation of Comment (fraser@google.com)
 *
 * @author egerndto@wellesley.edu (Emery Otopalik)
 */
'use strict';

goog.provide('Blockly.TextBubble');

goog.require('Blockly.Bubble');
goog.require('Blockly.Icon');
goog.require('goog.userAgent');


/**
 * Class for a textbubble.
 * @param {!Blockly.Block} block The block associated with this comment.
 *
 * [08/05/14, lyn] Added 2nd param to support multiple text bubbles on blocks.
 * @param {!String} opt_iconChar: A single character for icon.
 *
 * @extends {Blockly.Icon}
 * @constructor
 */
Blockly.TextBubble = function(block, opt_iconChar) {
    // options added for different comment boxes: Yail, Watch, DoIt, Standard Comment
    this.myblock = block; // added for tracking which block the comment is on
    this.iconChar = opt_iconChar ? opt_iconChar : '?';      //added for tracking which comment on the block we are on
    Blockly.TextBubble.superClass_.constructor.call(this, block);
    this.createIcon_();
};
goog.inherits(Blockly.TextBubble, Blockly.Icon);


/**
 * TextBubble text (if bubble is not visible).
 * @private
 */
Blockly.TextBubble.prototype.text_ = '';

/**
 * Width of bubble.
 * @private
 */
Blockly.TextBubble.prototype.width_ = 160;

/**
 * Height of bubble.
 * @private
 */
Blockly.TextBubble.prototype.height_ = 80;

/**
 * Create the icon on the block.
 * @private
 */
Blockly.TextBubble.prototype.createIcon_ = function() {
    Blockly.Icon.prototype.createIcon_.call(this);
    /* Here's the markup that will be generated:
     <circle class="blocklyIconShield" r="8" cx="8" cy="8"/>
     <text class="blocklyIconMark" x="8" y="13">?</text>
     */
    var iconShield = Blockly.createSvgElement('circle',
        {'class': 'blocklyIconShield',
            'r': Blockly.Icon.RADIUS,
            'cx': Blockly.Icon.RADIUS,
            'cy': Blockly.Icon.RADIUS}, this.iconGroup_);
    this.iconMark_ = Blockly.createSvgElement('text',
        {'class': 'blocklyIconMark',
            'x': Blockly.Icon.RADIUS,
            'y': 2 * Blockly.Icon.RADIUS - 3}, this.iconGroup_);
    // this.iconMark_.appendChild(document.createTextNode('?'));
    this.iconMark_.appendChild(document.createTextNode(this.iconChar));
};

/**
 * Create the editor for the textBubble's bubble. Includes various buttons to control behavior of textBubbles.
 * @return {!Element} The top-level node of the editor.
 * @private
 */
Blockly.TextBubble.prototype.createEditor_ = function() {
    /* Create the editor.  Here's the markup that will be generated:
     <foreignObject x="8" y="8" width="164" height="164">
     <body xmlns="http://www.w3.org/1999/xhtml" class="blocklyMinimalBody">
     <textarea xmlns="http://www.w3.org/1999/xhtml"
     class="blocklyCommentTextarea"
     style="height: 164px; width: 164px;"></textarea>
     </body>
     </foreignObject>
     */
    this.foreignObject_ = Blockly.createSvgElement('foreignObject',
        {'x': Blockly.Bubble.BORDER_WIDTH, 'y': Blockly.Bubble.BORDER_WIDTH},
        null);
    var body = document.createElementNS(Blockly.HTML_NS, 'body');
    body.setAttribute('xmlns', Blockly.HTML_NS);
    body.className = 'blocklyMinimalBody';

    //close button
    this.closeButton_ = document.createElementNS(Blockly.HTML_NS, 'button');
    if (this.iconChar == Blockly.BlocklyEditor.watchChar) {
        this.closeButton_.appendChild(document.createTextNode('Remove Watch'));
    } else if (this.iconChar == Blockly.BlocklyEditor.doitChar) {
        this.closeButton_.appendChild(document.createTextNode('Remove Do It'));
    } else if (this.iconChar == Blockly.BlocklyEditor.yailChar) {
        this.closeButton_.appendChild(document.createTextNode('Remove Yail'));
    } else {
        this.closeButton_.appendChild(document.createTextNode('Remove Comment'));
    }
    body.appendChild(this.closeButton_);
    Blockly.bindEvent_(this.closeButton_, 'mouseup', this, this.closeButtonClick_);  //emery

    //hide button
    this.hideButton_ = document.createElementNS(Blockly.HTML_NS, 'button');
    this.hideButton_.appendChild(document.createTextNode('Hide'));
    body.appendChild(this.hideButton_);
    Blockly.bindEvent_(this.hideButton_, 'mouseup', this, Blockly.Icon.prototype.iconClick_ );

    //clear button
    this.clearButton_ = document.createElementNS(Blockly.HTML_NS, 'button');
    this.clearButton_.appendChild(document.createTextNode('Clear'));
    body.appendChild(this.clearButton_);
    Blockly.bindEvent_(this.clearButton_, 'mouseup', this, this.clearButtonClick_);  //emery

    //toggle watch button
    if (this.iconChar == Blockly.BlocklyEditor.watchChar) {
        this.toggleButton_ = document.createElementNS(Blockly.HTML_NS, 'button');
        this.toggleButton_.appendChild(document.createTextNode('Turn Watch Off'));
        body.appendChild(this.toggleButton_);
        Blockly.bindEvent_(this.toggleButton_, 'mouseup', this, this.toggleButtonClick_);  //emery

        this.orderButton_ = document.createElementNS(Blockly.HTML_NS, 'button');
        this.orderButton_.appendChild(document.createTextNode('Print From Bottom'));
        body.appendChild(this.orderButton_);
        Blockly.bindEvent_(this.orderButton_, 'mouseup', this, this.orderButtonClick_);
        this.myblock.order = true;
    }

    //Do It Again button
    if (this.iconChar == Blockly.BlocklyEditor.doitChar) {
        this.doitButton_ = document.createElementNS(Blockly.HTML_NS, 'button');
        this.doitButton_.appendChild(document.createTextNode('Do It Again'));
        body.appendChild(this.doitButton_);
        Blockly.bindEvent_(this.doitButton_, 'mouseup', this, this.doitAgainButtonClick_);  //emery
    }

    //Regenerate Yail Button
    if (this.iconChar == Blockly.BlocklyEditor.yailChar) {
        this.yailButton_ = document.createElementNS(Blockly.HTML_NS, 'button');
        this.yailButton_.appendChild(document.createTextNode('Regenerate'));
        body.appendChild(this.yailButton_);
        Blockly.bindEvent_(this.yailButton_, 'mouseup', this, this.yailButtonClick_);
    }

    this.textarea_ = document.createElementNS(Blockly.HTML_NS, 'textarea');
    this.textarea_.className = 'blocklyCommentTextarea';
    this.textarea_.setAttribute('dir', Blockly.RTL ? 'RTL' : 'LTR');
    body.appendChild(this.textarea_);
    this.foreignObject_.appendChild(body);
    Blockly.bindEvent_(this.textarea_, 'mouseup', this, this.textareaFocus_);
    return this.foreignObject_;
};

/**
 * Closes a textBubble upon clicking close button.
 * @private
 */
Blockly.TextBubble.prototype.closeButtonClick_ = function(e) {
    if (this.iconChar == Blockly.BlocklyEditor.watchChar) {
        this.myblock.watch = false;
    } if (this.iconChar == Blockly.BlocklyEditor.commentChar) {
        this.myblock.setCommentText(null);
    } else {
        this.setTextBubbleText(this.myblock, this.iconChar, null);
    }
}


/**
 * Clears a textBubble upon clicking clear button.
 * @private
 */
Blockly.TextBubble.prototype.clearButtonClick_ = function(e) {
    this.setText("");
}

/**
 * Toggles watch on and off on Watch textBubble.
 * @private
 */
Blockly.TextBubble.prototype.toggleButtonClick_ = function(e) {
    if (this.myblock.watch) {
        this.myblock.watch = false;
        var text = this.getTextBubbleText(this.myblock, Blockly.BlocklyEditor.watchChar)
        if (this.myblock.order) {
            this.setTextBubbleText(this.myblock, Blockly.BlocklyEditor.watchChar, "------\n" + text);
        } else {
            this.setTextBubbleText(this.myblock, Blockly.BlocklyEditor.watchChar, text + "\n------");
        }
        this.toggleButton_.innerHTML = "Turn Watch On";
    } else {
        this.toggleButton_.innerHTML = "Turn Watch Off";
        this.myblock.watch = true;
    }
}

/**
 * Switches order of printing on Watch textBubble
 * @private
 */
Blockly.TextBubble.prototype.orderButtonClick_ = function(e) {
    this.myblock.order = !this.myblock.order;
    var text = this.getText();
    var split = text.split("\n");
    var string = "";
    for (var i = 0; i < split.length; i++) {
        string = split[i] + "\n" + string;
    }
    this.setText(string);
    if (this.orderButton_.innerHTML == "Print From Bottom") {
        this.orderButton_.innerHTML = "Print From Top";
    } else {
        this.orderButton_.innerHTML = "Print From Bottom";
    }
}

/**
 * Performs a Do It on the Do It textBubble
 * @private
 */
Blockly.TextBubble.prototype.doitAgainButtonClick_ = function(e) {
    this.myblock.doit = true;
    var yailText;
    var yailTextOrArray = Blockly.Yail.blockToCode1(this.myblock);
    if (yailTextOrArray instanceof Array) {
        yailText = yailTextOrArray[0];
    } else {
        yailText = yailTextOrArray;
    }
    Blockly.ReplMgr.putYail(yailText, this.myblock);
}

/**
 * Regenerates Yail on Yail textBubble.
 * @private
 */
Blockly.TextBubble.prototype.yailButtonClick_ = function(e) {
    var yailText;
    //Blockly.Yail.blockToCode1 returns a string if the block is a statement
    //and an array if the block is a value
    var yailTextOrArray = Blockly.Yail.blockToCode1(this.myblock);
    if (yailTextOrArray instanceof Array) {
        yailText = yailTextOrArray[0];
    } else {
        yailText = yailTextOrArray;
    }
    this.setText(yailText);
}


/**
 * Add or remove editability of the textBubble.
 * @override
 */
Blockly.TextBubble.prototype.updateEditable = function() {
    if (this.isVisible()) {
        // Toggling visibility will force a rerendering.
        this.setVisible(false);
        this.setVisible(true);
    }
    // Allow the icon to update.
    Blockly.Icon.prototype.updateEditable.call(this);
};

/**
 * Callback function triggered when the bubble has resized.
 * Resize the text area accordingly.
 * @private
 */
Blockly.TextBubble.prototype.resizeBubble_ = function() {
    var size = this.bubble_.getBubbleSize();
    var doubleBorderWidth = 2 * Blockly.Bubble.BORDER_WIDTH;
    this.foreignObject_.setAttribute('width', size.width - doubleBorderWidth);
    this.foreignObject_.setAttribute('height', size.height - doubleBorderWidth);
    this.textarea_.style.width = (size.width - doubleBorderWidth - 4) + 'px';
    this.textarea_.style.height = (size.height - doubleBorderWidth - 4) + 'px';
};

/**
 * Show or hide the textBubble bubble.
 * @param {boolean} visible True if the bubble should be visible.
 */
Blockly.TextBubble.prototype.setVisible = function(visible) {
    if (visible == this.isVisible()) {
        // No change.
        return;
    }
    if ((!this.block_.isEditable() && !this.textarea_) || goog.userAgent.IE) {
        // Steal the code from warnings to make an uneditable text bubble.
        // MSIE does not support foreignobject; textareas are impossible.
        // http://msdn.microsoft.com/en-us/library/hh834675%28v=vs.85%29.aspx
        // Always treat comments in IE as uneditable.
        Blockly.Warning.prototype.setVisible.call(this, visible);
        return;
    }
    // Save the bubble stats before the visibility switch.
    var text = this.getText();
    var size = this.getBubbleSize();
    if (visible) {
        // Create the bubble.
        this.bubble_ = new Blockly.Bubble(
            /** @type {!Blockly.Workspace} */ (this.block_.workspace),
            this.createEditor_(), this.block_.svg_.svgPath_,
            this.iconX_, this.iconY_,
            this.width_, this.height_);
        this.bubble_.registerResizeEvent(this, this.resizeBubble_);
        this.updateColour();
        this.text_ = null;
    } else {
        // Dispose of the bubble.
        this.bubble_.dispose();
        this.bubble_ = null;
        this.textarea_ = null;
        this.foreignObject_ = null;
    }
    // Restore the bubble stats after the visibility switch.
    this.setText(text);
    this.setBubbleSize(size.width, size.height);
};

/**
 * Bring the textBubble to the top of the stack when clicked on.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.TextBubble.prototype.textareaFocus_ = function(e) {
    // Ideally this would be hooked to the focus event for the comment.
    // However doing so in Firefox swallows the cursor for unknown reasons.
    // So this is hooked to mouseup instead.  No big deal.
    this.bubble_.promote_();
    // Since the act of moving this node within the DOM causes a loss of focus,
    // we need to reapply the focus.
    this.textarea_.focus();
};

/**
 * Get the dimensions of this textBubble's bubble.
 * @return {!Object} Object with width and height properties.
 */
Blockly.TextBubble.prototype.getBubbleSize = function() {
    if (this.isVisible()) {
        return this.bubble_.getBubbleSize();
    } else {
        return {width: this.width_, height: this.height_};
    }
};

/**
 * Size this textBubble's bubble.
 * @param {number} width Width of the bubble.
 * @param {number} height Height of the bubble.
 */
Blockly.TextBubble.prototype.setBubbleSize = function(width, height) {
    if (this.textarea_) {
        this.bubble_.setBubbleSize(width, height);
    } else {
        this.width_ = width;
        this.height_ = height;
    }
};

/**
 * Returns this textBubble's text.
 * @return {string} TextBubble text.
 */
Blockly.TextBubble.prototype.getText = function() {
    return this.textarea_ ? this.textarea_.value : this.text_;
};

/**
 * Set this textBubble's text.
 * @param {string} text TextBubble text.
 */
Blockly.TextBubble.prototype.setText = function(text) {
    if (this.textarea_) {
        this.textarea_.value = text;
    } else {
        this.text_ = text;
    }
};

/**
 * Dispose of this textBubble.
 */
Blockly.TextBubble.prototype.dispose = function() {
    if (this.iconChar == Blockly.BlocklyEditor.commentChar) {
        this.block_.comment = null;
        this.myblock.comment = null;
    }
    this.myblock.textBubbles[this.iconChar] = null;
    this.block_.textBubbles[this.iconChar] = null;
    Blockly.Icon.prototype.dispose.call(this);
};

/**
 * Gets the text on the textBubble with the specified icon on the specified block.
 * @param {block} block: the block the textBubble is on.
 * @param {?string} iconChar: the single-character string used to represent the bubble
 *   and index it in this.textBubbles.
 * @return {string} the text associated with the textBubble.
 */
Blockly.TextBubble.prototype.getTextBubbleText = function(block, iconChar) {
    this.textBubble = block.textBubbles[iconChar];
    if (this.textBubble) {
        var text = this.textBubble.getText();
        // Trim off trailing whitespace.
        return text.replace(/\s+$/, '').replace(/ +\n/g, '\n');
    }
    return '';
};

/**
 * Sets the text on the textBubble with the specified icon on the specified block.
 * @param {block} block: the block the textBubble is on.
 * @param {?string} iconChar: the single-character string used to represent the bubble
 *   and index it in this.textBubbles.
 * @param {?string} text The text, or null to delete.
 */
Blockly.TextBubble.prototype.setTextBubbleText = function(block, iconChar, text) {
    var textBubble = block.textBubbles[iconChar];
    var changedState = false;
    if (goog.isString(text)) {
        if (!textBubble) {
            textBubble = new Blockly.TextBubble(block, iconChar);
            block.textBubbles[iconChar] = textBubble;
           // if (iconChar == Blockly.BlocklyEditor.commentChar) {
             //   block.comment = textBubble;
            //}
            changedState = true;
        }
        // Watch originated from DoIt, so it prints off the first value automatically like a doit. This will ignore
        // the first value and clear up any confusion.
        if (iconChar == Blockly.BlocklyEditor.watchChar) {
            if (!block.watchIgnore) {
                textBubble.setText(/** @type {string} */ (text));
            } else {
                block.watchIgnore = false;
            }
        } else {
            textBubble.setText(/** @type {string} */ (text));
        }
    } else {
        if (textBubble) {
            textBubble.dispose();
            changedState = true;
        }
    }
    if (block.rendered) {
        block.render();
        if (changedState) {
            // Adding or removing a comment icon will cause the block to change shape.
            block.bumpNeighbours_();
        }
    }
};
