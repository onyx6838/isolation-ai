import React from "react";
import $ from "jquery";

class Player extends React.Component {

    render() {
        // Adjust offset to position player icons on grid.
        let leftOffset = 25;
        let topOffset = 5;
        const container = $('#app');
        if (container.length) {
            const rect = container[0].getBoundingClientRect();
            leftOffset = rect.left + 15;
            topOffset = rect.top + 5;
        }

        return (
            <i className={`player ${this.props.cellStyle || ''} fas fa-female`}
                style={{
                    top: `${this.props.y * this.props.height + topOffset}px`,
                    left: `${this.props.x * this.props.width + leftOffset}px`,
                    color: this.props.color,
                    backgroundColor: this.props.backgroundColor
                }}></i>
        );
    }
}

export default Player