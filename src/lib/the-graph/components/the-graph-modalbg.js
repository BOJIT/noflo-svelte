/**
 * @file the-graph-modalbg.js
 * @author James Bennion-Pedley
 * @brief ES6 port of modalbg component
 * @date 24/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import React from 'react';
import ReactDOM from 'react-dom';

import merge from '../utils/merge';
import baseFactories from '../utils/factories';

/*------------------------------ Implementation ------------------------------*/

const config = {
    container: {},
    rect: {
        ref: 'rect',
        className: 'context-modal-bg',
    },
};

const factories = {
    createModalBackgroundGroup: baseFactories.createGroup,
    createModalBackgroundRect: baseFactories.createRect,
};

/*------------------------------ Primary Class -------------------------------*/

class TheGraphModalBG extends React.Component {
    displayName = 'TheGraphModalBG';

    componentDidMount() {
        const domNode = ReactDOM.findDOMNode(this);
        const rectNode = this.refs.rect;

        // Right-click on another item will show its menu
        domNode.addEventListener('mousedown', (event) => {
          // Only if outside of menu
            if (event && event.target === rectNode) {
                this.hideModal();
            }
        });
    }

    hideModal(event) {
        this.props.triggerHideContext();
    }

    render() {
        let rectOptions = {
            width: this.props.width,
            height: this.props.height,
        };

        rectOptions = merge(config.rect, rectOptions);
        const rect = factories.createModalBackgroundRect.call(this, rectOptions);

        const containerContents = [rect, this.props.children];
        const containerOptions = merge(config.container, {});
        return factories.createModalBackgroundGroup.call(this, containerOptions, containerContents);
    }
}

const ModalBG = React.createElement.bind(null, TheGraphModalBG);

/*----------------------------------------------------------------------------*/

export default {
    ModalBG,
    config,
    factories,
};
