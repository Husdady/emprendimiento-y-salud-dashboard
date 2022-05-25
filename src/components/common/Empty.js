// React
import { Component } from "react";

// Librarys
import Image from 'next/image'

// Utils
import { classnames } from '@utils/Helper'

export default class Empty extends Component {
  static defaultProps = {
    width: 400,
    height: 400,
    withCustomMargin: false
  };

  constructor(props) {
    super(props);
    this.emptyClasses = classnames([
      "empty-content d-flex align-items-center flex-column",
      !this.props.withCustomMargin ? 'mt-3' : null
    ])

    this.styles = {
      title: {
        fontSize: "1.15em",
        color: "var(--bg-gray-200)",
        ...this.props.titleStyle,
      },
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className={this.emptyClasses} style={this.props.style}>
        <Image
          loading="eager"
          objectFit="contain"
          placeholder="blur"
          alt="empty-image-content"
          src={this.props.image}
          width={this.props.width}
          height={this.props.height}
          blurDataURL={this.props.image}
        />

        <span className="title text-center mt-3" style={this.styles.title}>
          {this.props.title}
        </span>
      </div>
    );
  }
}
