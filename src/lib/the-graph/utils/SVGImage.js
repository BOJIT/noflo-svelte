/**
 * @file SVGImage.js
 * @author James Bennion-Pedley
 * @brief ES6 Port of SVGImage
 * @date 23/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import React from 'react';

/*------------------------------ Primary Class -------------------------------*/

class TheGraphSVGImage extends React.Component {
    displayName = 'TheGraphSVGImage';

    render() {
        let html = '<image ';
        html = `${html}xlink:href="${this.props.src}"`;
        html = `${html}x="${this.props.x}"`;
        html = `${html}y="${this.props.y}"`;
        html = `${html}width="${this.props.width}"`;
        html = `${html}height="${this.props.height}"`;
        html = `${html}/>`;

        return React.createElement('g', {
            className: this.props.className,
            dangerouslySetInnerHTML: { __html: html },
        });
    }
}

/*----------------------------------------------------------------------------*/

export default React.createElement.bind(null, TheGraphSVGImage);
