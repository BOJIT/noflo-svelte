/**
 * @file the-graph-node-menu.js
 * @author James Bennion-Pedley
 * @brief ES6 port of the-graph-node-menu component
 * @date 24/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import React from 'react';
import ReactDOM from 'react-dom';

/*------------------------------ Implementation ------------------------------*/

function register(context) {
  const { TheGraph } = context;

  TheGraph.config.nodeMenu = {
    container: {
      className: 'context-node',
    },
    inports: {},
    outports: {},
    menu: {
      x: 0,
      y: 0,
    },
  };

  TheGraph.factories.nodeMenu = {
    createNodeMenuGroup: TheGraph.factories.createGroup,
    createNodeMenuInports: createNodeMenuPorts,
    createNodeMenuOutports: createNodeMenuPorts,
    createNodeMenuMenu,
  };

  function createNodeMenuPorts(options) {
    return TheGraph.NodeMenuPorts(options);
  }

  function createNodeMenuMenu(options) {
    return TheGraph.Menu(options);
  }

  class TheGraphNodeMenu extends React.Component {
    displayName = 'TheGraphNodeMenu';
    radius = 72;

    topPropagation(event) {
        // Don't drag graph
        event.stopPropagation();
    }

    componentDidMount() {
        // Prevent context menu
        ReactDOM.findDOMNode(this).addEventListener('contextmenu', (event) => {
          event.stopPropagation();
          event.preventDefault();
        }, false);
    }

    render() {
        const { scale } = this.props.node.props.app.state;
        const { ports } = this.props;
        const { deltaX } = this.props;
        const { deltaY } = this.props;

        let inportsOptions = {
          ports: ports.inports,
          isIn: true,
          scale,
          processKey: this.props.processKey,
          deltaX,
          deltaY,
          nodeWidth: this.props.nodeWidth,
          nodeHeight: this.props.nodeHeight,
          highlightPort: this.props.highlightPort,
        };

        inportsOptions = TheGraph.merge(TheGraph.config.nodeMenu.inports, inportsOptions);
        const inports = TheGraph.factories.nodeMenu.createNodeMenuInports.call(this, inportsOptions);

        let outportsOptions = {
          ports: ports.outports,
          isIn: false,
          scale,
          processKey: this.props.processKey,
          deltaX,
          deltaY,
          nodeWidth: this.props.nodeWidth,
          nodeHeight: this.props.nodeHeight,
          highlightPort: this.props.highlightPort,
        };

        outportsOptions = TheGraph.merge(TheGraph.config.nodeMenu.outports, outportsOptions);
        const outports = TheGraph.factories.nodeMenu.createNodeMenuOutports.call(this, outportsOptions);

        let menuOptions = {
          menu: this.props.menu,
          options: this.props.options,
          triggerHideContext: this.props.triggerHideContext,
          icon: this.props.icon,
          label: this.props.label,
        };

        menuOptions = TheGraph.merge(TheGraph.config.nodeMenu.menu, menuOptions);
        const menu = TheGraph.factories.nodeMenu.createNodeMenuMenu.call(this, menuOptions);

        const children = [
          inports, outports, menu,
        ];

        let containerOptions = {
          transform: `translate(${this.props.x},${this.props.y})`,
          children,
        };
        containerOptions = TheGraph.merge(TheGraph.config.nodeMenu.container, containerOptions);
        return TheGraph.factories.nodeMenu.createNodeMenuGroup.call(this, containerOptions);
    }
  }

  TheGraph.NodeMenu = React.createElement.bind(null, TheGraphNodeMenu);
};

/*----------------------------------------------------------------------------*/

export default {
    register
}