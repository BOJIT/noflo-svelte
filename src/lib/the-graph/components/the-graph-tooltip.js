/**
 * @file the-graph-tooltip.js
 * @author James Bennion-Pedley
 * @brief ES6 port of tooltip component
 * @date 24/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import React from 'react';

import merge from '../utils/merge';
import defaultFactories from '../utils/factories';

/*------------------------------ Implementation ------------------------------*/

const config = {
    container: {},
    rect: {
        className: 'tooltip-bg',
        x: 0,
        y: -7,
        rx: 3,
        ry: 3,
        height: 16,
    },
    text: {
        className: 'tooltip-label',
        ref: 'label',
    },
};

const factories = {
    createTooltipGroup: defaultFactories.createGroup,
    createTooltipRect: defaultFactories.createRect,
    createTooltipText: defaultFactories.createText,
};

/*------------------------------ Primary Class -------------------------------*/

class TheGraphTooltip extends React.Component {
    displayName = 'TheGraphTooltip';

    render() {
        const rectOptions = merge(config.rect, { width: this.props.label.length * 6 });
        const rect = factories.createTooltipRect.call(this, rectOptions);

        const textOptions = merge(config.text, { children: this.props.label });
        const text = factories.createTooltipText.call(this, textOptions);

        const containerContents = [rect, text];

        let containerOptions = {
            className: `tooltip${this.props.visible ? '' : ' hidden'}`,
            transform: `translate(${this.props.x},${this.props.y})`,
        };
        containerOptions = merge(config.container, containerOptions);
        return factories.createTooltipGroup.call(this, containerOptions, containerContents);
    }
}

const Tooltip = React.createElement.bind(null, TheGraphTooltip);

/*----------------------------------------------------------------------------*/

export default {
    config,
    factories,
    Tooltip,
};
