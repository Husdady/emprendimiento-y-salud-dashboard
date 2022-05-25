// React
import { Component } from "react";

// Librarys
import { connect } from 'react-redux'

// Reducers
import { getThemeState } from '@redux/reducers/theme'

// Utils
import { classnames } from '@utils/Helper'

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.darkTheme = this.props.theme === 'dark'
    this.wrapperClasses = classnames([
      'wrapper px-3 rounded-2',
      this.darkTheme ? 'mt-2 mb-1' : 'mt-3 mb-2',
      this.props.paddingY ?? 'py-2',
      this.props.className,
    ])
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <section className={this.wrapperClasses} style={this.props.style}>
        {this.props.children}
      </section>
    );
  }
}

export default connect(getThemeState)(Wrapper)
