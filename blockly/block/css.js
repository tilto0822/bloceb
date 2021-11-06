import Blockly from 'blockly/core';

import { createPlusField } from './plus-minus/field_plus';
import { createMinusField } from './plus-minus/field_minus';

import { Color } from '../lib/constant';

const listCreateMutator = {
    itemCount_: 0,

    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },

    domToMutation: function (xmlElement) {
        const targetCount = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_(targetCount);
    },

    updateShape_: function (targetCount) {
        while (this.itemCount_ < targetCount) {
            this.addPart_();
        }
        while (this.itemCount_ > targetCount) {
            this.removePart_();
        }
        this.updateMinus_();
    },

    plus: function () {
        this.addPart_();
        this.updateMinus_();
    },

    minus: function () {
        if (this.itemCount_ == 0) {
            return;
        }
        this.removePart_();
        this.updateMinus_();
    },
    addPart_: function () {
        if (this.itemCount_ == 0) {
            this.removeInput('EMPTY');
            this.topInput_ = this.appendValueInput('ADD' + this.itemCount_)
                .appendField(createPlusField(), 'PLUS')
                .appendField('CSS 확장');
        } else {
            this.appendValueInput('ADD' + this.itemCount_);
        }
        this.itemCount_++;
    },

    removePart_: function () {
        this.itemCount_--;
        this.removeInput('ADD' + this.itemCount_);
        if (this.itemCount_ == 0) {
            this.topInput_ = this.appendDummyInput('EMPTY')
                .appendField(createPlusField(), 'PLUS')
                .appendField('CSS 확장');
        }
    },

    updateMinus_: function () {
        const minusField = this.getField('MINUS');
        if (!minusField && this.itemCount_ > 0) {
            this.topInput_.insertFieldAt(1, createMinusField(), 'MINUS');
        } else if (minusField && this.itemCount_ < 1) {
            this.topInput_.removeField('MINUS');
        }
    },
};

const listCreateHelper = function () {
    this.getInput('EMPTY').insertFieldAt(0, createPlusField(), 'PLUS');
    this.updateShape_(0);
};

export default function setCssBlocks() {
    Blockly.Blocks['css_extend'] = {
        init: function () {
            this.appendDummyInput('EMPTY').appendField('CSS 확장');
            this.setInputsInline(false);
            this.setOutput(true, 'CSS_EXTEND');
            this.setColour(330);
            this.setTooltip('css를 확장하여 디자인을 수정합니다.');
            this.setHelpUrl('');
            this.jsonInit({
                mutator: 'css_extend_mutator',
            });
        },
    };

    Blockly.JavaScript['css_extend'] = function (block) {
        var value_name = Blockly.JavaScript.valueToCode(
            block,
            'NAME',
            Blockly.JavaScript.ORDER_ATOMIC
        );
        // TODO: Assemble JavaScript into code variable.
        var code = '...';
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_NONE];
    };

    Blockly.Extensions.registerMutator(
        'css_extend_mutator',
        listCreateMutator,
        listCreateHelper
    );
}
