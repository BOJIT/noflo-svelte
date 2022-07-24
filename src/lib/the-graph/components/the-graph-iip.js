/**
 * @file the-graph-iip.js
 * @author James Bennion-Pedley
 * @brief ES6 port of the-graph-iip component
 * @date 24/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import React from 'react';

import TextBG from '../utils/TextBG';

/*------------------------------ Implementation ------------------------------*/

function register(context) {
  const { TheGraph } = context;

  TheGraph.config.iip = {
    container: {
      className: 'iip',
    },
    path: {
      className: 'iip-path',
    },
    text: {
      className: 'iip-info',
      height: 5,
      halign: 'right',
    },
  };

  TheGraph.factories.iip = {
    createIIPContainer: TheGraph.factories.createGroup,
    createIIPPath: TheGraph.factories.createPath,
    createIIPText,
  };

  function createIIPText(options) {
    return TextBG(options);
  }

  // Const
  const CURVE = 50;

  // Edge view
  class TheGraphIIP extends React.Component {
    displayName = 'TheGraphIIP';

    shouldComponentUpdate(nextProps, nextState) {
        // Only rerender if changed

        return (
          nextProps.x !== this.props.x
          || nextProps.y !== this.props.y
          || nextProps.label !== this.props.label
        );
    }

    render() {
        const { x } = this.props;
        const { y } = this.props;

        const path = [
          'M', x, y,
          'L', x - 10, y,
        ].join(' ');

        // Make a string
        let label = `${this.props.label}`;
        // TODO make this smarter with ZUI
        if (label.length > 12) {
          label = `${label.slice(0, 9)}...`;
        }

        const pathOptions = TheGraph.merge(TheGraph.config.iip.path, { d: path });
        const iipPath = TheGraph.factories.iip.createIIPPath.call(this, pathOptions);

        const textOptions = TheGraph.merge(TheGraph.config.iip.text, { x: x - 10, y, text: label });
        const text = TheGraph.factories.iip.createIIPText.call(this, textOptions);

        const containerContents = [iipPath, text];

        const containerOptions = TheGraph.merge(TheGraph.config.iip.container, { title: this.props.label });
        return TheGraph.factories.iip.createIIPContainer.call(this, containerOptions, containerContents);
    }
  }

  TheGraph.IIP = React.createElement.bind(null, TheGraphIIP);
};

/*----------------------------------------------------------------------------*/

export default {
    register
}
