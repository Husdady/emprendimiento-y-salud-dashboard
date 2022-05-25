// React
import { Component, Fragment } from "react";

// Librarys
import { Skeleton } from "antd";

// Utils
import { classnames } from '@utils/Helper'

const positions = {
  top: 'justify-content-start',
  center: 'justify-content-center',
  bottom: 'justify-content-end'
}

export default class SkeletonForm extends Component {
  static defaultProps = {
    uploadImage: {},
    skeletonFields: [],
  };

  constructor(props) {
    super(props);
    this.mq = window.innerWidth <= 900;
    this.renderSkeleton = this.renderSkeleton.bind(this);
    this.renderSkeletonFields = this.renderSkeletonFields.bind(this);

    this.uploadImageClasses = classnames([
      'd-flex align-items-center flex-column',
      positions[this.props.position]
    ])

    this.styles = {
      floatRightButton: {
        width: 200,
        height: 35,
      },
      title: {
        width: 250,
        height: 15,
      },
      input: {
        height: 40,
        width: "100%",
        marginBottom: "1.5em",
      },
      lastInput: {
        height: 40,
        width: "100%",
      },
      textArea: {
        height: 200,
        width: "100%",
        marginBottom: "1.5em",
      },
      lastTextArea: {
        height: 200,
        width: "100%",
      },
    };

    this.floatingButton = (
      <Skeleton.Button
        active
        className="save-button float-end mb-3"
        style={this.styles.floatRightButton}
      />
    );
  }

  shouldComponentUpdate(nextProps) {
    return this.props.loading !== nextProps.loading;
  }

  // Renderizar campos de Skeleton
  renderSkeletonFields() {
    return this.props.fields.map((type, i, totalFields) => {
      const isTypeZero = type === 0
      const lastPosition = i === totalFields.length - 1;
      const isLastInput = lastPosition ? this.styles.lastInput : this.styles.input
      const isLastTextArea = lastPosition ? this.styles.lastTextArea : this.styles.textArea

      return (
        <Fragment key={i}>
          <Skeleton.Button active className="d-block mb-3" style={this.styles.title} />
          <Skeleton.Button
            active
            block
            style={isTypeZero ? isLastInput : isLastTextArea}
          />
        </Fragment>
      );
    });
  }

  renderSkeleton() {
    return (
      <div
        style={this.props.style}
        className="container-skeleton d-flex flex-wrap justify-content-between rounded-3"
      >
        <div id="upload-image" style={this.props.uploadStyleImage} className={this.uploadImageClasses}>
          <Skeleton.Avatar active size={250} />
          <Skeleton.Button active className="form-button w-100 mx-auto mt-4 mb-3" />
          <Skeleton.Button active className="form-button w-100" />
        </div>

        <div className="form-field-container d-flex flex-column">
          {/* Botón flotante */}
          {this.floatingButton}

          {/* Campos */}
          {this.renderSkeletonFields()}
        </div>
      </div>
    );
  }

  render() {
    // Si está cargando mostrar skeleton
    if (this.props.loading) {
      return this.renderSkeleton();
    }

    return this.props.children;
  }
}
