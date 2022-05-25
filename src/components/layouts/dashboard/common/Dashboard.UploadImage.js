// React
import { Component, Fragment, createRef } from "react";

// Components
import { Button } from "@common";

// Librarys
import { Avatar, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { classnames } from '@utils/Helper'

const positions = {
  top: 'justify-content-start',
  center: 'justify-content-center',
  bottom: 'justify-content-end'
}

export default class UploadImage extends Component {
  static defaultProps = {
    position: 'center'
  } 

  constructor(props) {
    super(props);
    this.inputFile = createRef();
    this.chooseImage = this.chooseImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.removePreviewImage = this.removePreviewImage.bind(this);

    this.state = {
      previewImage: this.props.value,
    };

    this.uploadImageClasses = classnames([
      'd-flex align-items-center flex-column',
      positions[this.props.position]
    ])

    this.avatarSize = {
      xs: 250,
      sm: 250,
      md: 250,
      lg: 250,
      xl: 250,
      xxl: 275,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.value !== nextProps.value ||
      this.state.previewImage !== nextState.previewImage
    );
  }

  // Subir imagen y previzualizar imagen
  uploadImage(e) {
    const image = e.target.files[0];

    if (image) {
      // Crear url de la imagen seleccionada
      const previewImage = URL.createObjectURL(image);

      // Mostrar prevializuación de foto seleccionada
      this.setState({ previewImage: previewImage });
      this.props.extraData.setFieldValue(this.props.extraData.field, image);
      
      // Eliminar url de la imagen seleccionada
      URL.revokeObjectURL(image);
    }

    e.target.value = "";
  }

  // Eliminar foto de perfil
  removeImage() {
    // Si existe una imagen
    if (this.props.value !== null) {
      this.removePreviewImage();
      this.props.extraData.setFieldValue(this.props.extraData.field, null);
    } else {
      message.warning("Debes proporcionar una imagen para poder eliminarla!");
    }
  }

  // Eliminar previsualización de la imagen
  removePreviewImage() {
    this.setState({ previewImage: "" });
  }

  // Elegir una imagen
  chooseImage() {
    this.inputFile.current?.click();
  }

  render() {
    const { value } = this.props;
    const opacityWrapperClasses = classnames([
      'opacity-wrapper d-flex justify-content-center align-items-center position-absolute top-0 start-0 bottom-0 end-0 rounded-pill',
      value ? 'preview' : null
    ])

    return (
      <Fragment>
        <div id="upload-image" style={this.props.style} className={this.uploadImageClasses}>
          <div className="wrapper-image d-table position-relative">
            {/* Imagen */}
            <label htmlFor="upload-image-dk19lo" className="pointer">
              <div role="button" style={{ opacity: value ? 0 : 1 }} className={opacityWrapperClasses}>
                <FontAwesomeIcon icon="image" size="6x" />
              </div>

              <Avatar
                size={this.avatarSize}
                src={this.state.previewImage}
                style={value ? this.props.extraData.avatarStyle : null}
              />
            </label>

            {/* File */}
            <input
              ref={this.inputFile}
              type="file"
              name="image"
              className="d-none"
              id="upload-image-dk19lo"
              accept="png, .jpg, .jpeg, .webp"
              onChange={this.uploadImage}
            />
          </div>

          {/* Botón de eliminar usuario */}
          <Button
            title="Eliminar foto"
            className="w-100 mt-3 rounded-pill"
            onClick={this.removeImage}
            icon={{ name: "trash-alt" }}
            attributes={{ type: "button" }}
          />

          {/* Botón de elegir foto de usuario */}
          <Button
            className="w-100 mt-2 rounded-pill"
            icon={{ name: "camera" }}
            title="Elegir una foto"
            onClick={this.chooseImage}
            attributes={{ type: "button" }}
          />
        </div>
      </Fragment>
    );
  }
}
